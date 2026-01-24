import { Application, Graphics, mapFormatToGlInternalFormat, Particle, ParticleContainer, Text, Texture } from 'pixi.js';
import { JSX, useEffect, useRef } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../css/examples.module.css';

var resizeHandler: EventListener | any;

// Data state
type State = {
  data: Data;
}

// Data point
type Data = {
  rpm: Buffer;
  tps: Buffer;
}


export default function DotPlot(): JSX.Element {
  const pixiContainerRef = useRef<HTMLDivElement>(null);

  // Graph bounds
  const LEFT_MARGIN = 90;
  const RIGHT_MARGIN = 25;
  const BOTTOM_MARGIN = 70;
  const TOP_MARGIN = 25;
  const GRAPH_MARGIN = 25;
  const X_MIN_LIMIT = -2;
  const X_MAX_LIMIT = 2;
  const Y_MIN_LIMIT = -2;
  const Y_MAX_LIMIT = 2;
  var windowSize: number;
  var xDataMax = -Infinity, xDataMin = Infinity;
  var yDataMax = -Infinity, yDataMin = Infinity;
  var graphXMin = 0, graphXMax = 0;
  var graphYMin = 0, graphYMax = 0;
  
  // Graph tick spacing
  const CLEAN_SPACINGS = [1, 0.4, 0.2, 0.1];

  // Graph X ticks
  const X_TICK_LEN = 10;
  var xTickInterval = 0, xTargetSpacing = 0, xBasePower = 0, numXTicks = 0;
  
  // Graph Y ticks
  const Y_TICK_LEN = 10;
  var yTickInterval = 0, yTargetSpacing = 0, yBasePower = 0, numYTicks = 0;

  // Graph data
  const MAX_VERTICES = 1000;
  var datasets = [];
  var currentState = { data: { rpm: 0, tps: 0 } };
  var startingPoint = { rpm: 0, tps: 0 };
  var angle = 0;
  var sampleCount = 0;
  
  useEffect(() => {
    const initPixiApp = async () => {
      // Local refs so cleanup can access them
      let appRef: Application | null = null;
      let graphicsRef: Graphics | null = null;
      const xLabelPool: Text[] = [];
      const yLabelPool: Text[] = [];
      let createdTexts = 0;
      let createdGraphics = 0;
      const partContainer: ParticleContainer = new ParticleContainer({ dynamicProperties: { position: true, color: true } } );
      const particles: Particle[] = [];
      
      // Create a new application
      const app = new Application();
      appRef = app;
      
      // Initialize the application
      await app.init({ background: '#FFFFFF', antialias: true });
      
      // Create and reuse a single Graphics instance (or a small set of layers)
      graphicsRef = new Graphics();
      createdGraphics++;
      app.stage.addChild(graphicsRef);
    
      // Create plot point texture
      const pointGraphics: Graphics = new Graphics();
      pointGraphics.circle(0, 0, 1);
      pointGraphics.stroke({ width: 4, color: 0x000000 });
      const pointTex: Texture = app.renderer.generateTexture(pointGraphics);
      app.stage.addChild(partContainer);

      // Initialize particles (data points)
      for (let i = 0; i < MAX_VERTICES; i++) {
        const p: Particle = new Particle({ texture: pointTex, x: 0, y: 0, anchorX: 0.5, anchorY: 0.5 });
        p.color = 0x00000000;
        partContainer.addParticle(p);
        particles.push(p);
      }

      // Prepare a small pool of Y-label Text objects and reuse them every frame
      const MAX_AXIS_LABELS = 20; // reasonable upper bound for ticks
      for (let i = 0; i < MAX_AXIS_LABELS; i++) {
        const lbl = new Text('', { fontFamily: 'short-stack', fontSize: 18 });
        lbl.anchor = { x: 1, y: 0.5 } as any;
        lbl.visible = false;
        app.stage.addChild(lbl);
        yLabelPool.push(lbl);
        createdTexts++;
      }
      for (let i = 0; i < MAX_AXIS_LABELS; i++) {
        const lbl = new Text('', { fontFamily: 'short-stack', fontSize: 18 });
        lbl.anchor = { x: 0.5, y: 0 } as any;
        lbl.visible = false;
        app.stage.addChild(lbl);
        xLabelPool.push(lbl);
        createdTexts++;
      }

      // X axis name
      const xAxisTitle = new Text('TPS', { fontFamily: 'arial', fontSize: 18 });
      xAxisTitle.anchor = { x: 0.5, y: 0.5 };
      app.stage.addChild(xAxisTitle);
      
      // Y axis name
      const yAxisTitle = new Text('RPM', { fontFamily: 'arial', fontSize: 18 });
      yAxisTitle.anchor = { x: 0.5, y: 0.5 };
      yAxisTitle.rotation = -Math.PI / 2;
      app.stage.addChild(yAxisTitle);



      ////////// Draw function - called continuously (60fps) //////////
      const draw = () => {
        ///// Initialization /////

        if (!graphicsRef) return;

        // Reuse graphics: clear instead of creating/destroying every frame
        graphicsRef.clear();
        xDataMax = -Infinity, xDataMin = Infinity;
        yDataMax = -Infinity, yDataMin = Infinity;

        // Update axis positions
        xAxisTitle.x = (windowSize + LEFT_MARGIN - RIGHT_MARGIN) / 2;
        xAxisTitle.y = windowSize - 15;
        yAxisTitle.x = 15;
        yAxisTitle.y = (windowSize + TOP_MARGIN - BOTTOM_MARGIN) / 2;
        
        // Resize the graph bounds to fit the shown points
        for (let i = 1; i < Math.min(sampleCount, MAX_VERTICES); i++) {
          let dataPoint = sampleCount < MAX_VERTICES ? datasets[i] : datasets[datasets.length - MAX_VERTICES + i];
          
          xDataMax = Math.max(dataPoint.tps, xDataMax);
          xDataMin = Math.min(dataPoint.tps, xDataMin);
          yDataMax = Math.max(dataPoint.rpm, yDataMax);
          yDataMin = Math.min(dataPoint.rpm, yDataMin);
        }

        // Ensure minimum graph size
        xDataMin = Math.min(xDataMin, X_MIN_LIMIT);
        xDataMax = Math.max(xDataMax, X_MAX_LIMIT);
        yDataMin = Math.min(yDataMin, Y_MIN_LIMIT);
        yDataMax = Math.max(yDataMax, Y_MAX_LIMIT);
        
        // Update the drawing bounds
        graphXMin = LEFT_MARGIN;
        graphYMin = TOP_MARGIN;
        graphXMax = windowSize - RIGHT_MARGIN;
        graphYMax = windowSize - BOTTOM_MARGIN;
        
        
        ///// X Tick lines /////
        
        // Prepare X tick lines with guards to avoid NaN/Infinity
        const xDataRange = isFinite(xDataMax) && isFinite(xDataMin) && xDataMax !== xDataMin ? xDataMax - xDataMin : 1;
        xTargetSpacing = xDataRange / ((windowSize - LEFT_MARGIN - RIGHT_MARGIN) / 45.0); // Split range based on screen size
        if (xTargetSpacing <= 0 || !isFinite(xTargetSpacing)) xTargetSpacing = 1;
        xBasePower = Math.pow(10, Math.floor(Math.log10(xTargetSpacing))); // Find decimal place of spacing
        const xSpacingCandidate = CLEAN_SPACINGS.find(s => xBasePower / s >= xTargetSpacing) ?? 1;
        xTickInterval = xBasePower / xSpacingCandidate; // Round to clean interval (1, 0.5, 0.25, 0.1)

        numXTicks = Math.max(0, Math.round(xDataRange / xTickInterval) + 2); // Overestimate to be safe
        const firstXTick = (Math.round(xDataMax / xTickInterval)) * xTickInterval;
        
        // Draw the X ticks and grid lines (reuse pooled Text labels)
        for (let i = 0; i < numXTicks; i++) {
          // Get the next tick position
          let tickX = firstXTick - (i * xTickInterval);
          let graphX = convertGraphToScreenX(tickX);
          let isWithinBounds = (graphX <= graphXMax + 1 && graphX >= graphXMin - 1);

          // Check if even/odd tick line
          let isEvenTick = (i + (firstXTick / xTickInterval)) % 2 == 0;

          // Only draw if within bounds
          if (isWithinBounds) {
            // Draw the tick line
            graphicsRef.moveTo(graphX, windowSize - BOTTOM_MARGIN);
            graphicsRef.lineTo(graphX, windowSize - BOTTOM_MARGIN + (isEvenTick ? X_TICK_LEN : X_TICK_LEN / 2));
            graphicsRef.stroke({ width: 2, color: 0x000000 });
            
            // Draw grid line for x
            graphicsRef.moveTo(graphX, graphYMin);
            graphicsRef.lineTo(graphX, graphYMax);
            graphicsRef.stroke({ width: 2, color: 0x000000, alpha: isEvenTick ? 0x888888 : 0xDDDDDD });
          }

          // Draw the tick value using a pooled Text label
          const lbl = xLabelPool[i];
          if (lbl) {
            lbl.text = tickX.toFixed(2);
            lbl.x = graphX;
            lbl.y = windowSize - (BOTTOM_MARGIN - X_TICK_LEN - 5);
            lbl.visible = isWithinBounds;
          }
          graphicsRef.stroke({ width: 2, color: 0x000000 });
        }
        // Hide any unused pooled labels
        for (let i = numXTicks; i < xLabelPool.length; i++) xLabelPool[i].visible = false;


        ///// Y Tick lines /////
        
        // Prepare Y tick lines with guards to avoid NaN/Infinity
        const yDataRange = isFinite(yDataMax) && isFinite(yDataMin) && yDataMax !== yDataMin ? yDataMax - yDataMin : 1;
        yTargetSpacing = yDataRange / ((windowSize - TOP_MARGIN - BOTTOM_MARGIN) / 45.0); // Split range based on screen size
        if (yTargetSpacing <= 0 || !isFinite(yTargetSpacing)) yTargetSpacing = 1;
        yBasePower = Math.pow(10, Math.floor(Math.log10(yTargetSpacing))); // Find decimal place of spacing
        const spacingCandidate = CLEAN_SPACINGS.find(s => yBasePower / s >= yTargetSpacing) ?? 1;
        yTickInterval = yBasePower / spacingCandidate; // Round to clean interval (1, 0.5, 0.25, 0.1)

        numYTicks = Math.max(0, Math.round(yDataRange / yTickInterval) + 2); // Overestimate to be safe
        const firstYTick = (Math.round(yDataMax / yTickInterval)) * yTickInterval;
        
        // Draw the Y ticks and grid lines (reuse pooled Text labels)
        for (let i = 0; i < numYTicks; i++) {
          // Get the next tick position
          let tickY = firstYTick - (i * yTickInterval);
          let graphY = convertGraphToScreenY(tickY);
          let isWithinBounds = (graphY <= graphYMax + 1 && graphY >= graphYMin - 1);

          // Check if even/odd tick line
          let isEvenTick = (i + (firstYTick / yTickInterval)) % 2 == 0;

          // Only draw if within bounds
          if (isWithinBounds) {
            // Draw the tick line
            graphicsRef.moveTo(graphXMin, graphY);
            graphicsRef.lineTo(graphXMin - (isEvenTick ? Y_TICK_LEN : Y_TICK_LEN / 2), graphY);
            graphicsRef.stroke({ width: 2, color: 0x000000 });
            
            // Draw grid line for y
            graphicsRef.moveTo(graphXMin, graphY);
            graphicsRef.lineTo(graphXMax, graphY);
            graphicsRef.stroke({ width: 2, color: 0x000000, alpha: isEvenTick ? 0x888888 : 0xDDDDDD });
          }
          
          // Draw the tick value using a pooled Text label
          const lbl = yLabelPool[i];
          if (lbl) {
            lbl.text = tickY.toFixed(2);
            lbl.x = LEFT_MARGIN - Y_TICK_LEN - 5;
            lbl.y = graphY;
            lbl.visible = isWithinBounds;
          }
          graphicsRef.stroke({ width: 2, color: 0x000000 });
        }
        // Hide any unused pooled labels
        for (let i = numYTicks; i < yLabelPool.length; i++) yLabelPool[i].visible = false;
        
        // Draw the midlines
        if (convertGraphToScreenY(0) <= graphYMax && convertGraphToScreenY(0) >= graphYMin) {
          graphicsRef.moveTo(graphXMin, convertGraphToScreenY(0));
          graphicsRef.lineTo(graphXMax, convertGraphToScreenY(0));
          graphicsRef.stroke({ width: 3, color: 0x000000 });
        }
        if (convertGraphToScreenX(0) <= graphXMax && convertGraphToScreenX(0) >= graphXMin) {
          graphicsRef.moveTo(convertGraphToScreenX(0), graphYMin);
          graphicsRef.lineTo(convertGraphToScreenX(0), graphYMax);
          graphicsRef.stroke({ width: 3, color: 0x000000 });
        }


        ///// Plot points /////

        // Start the line from the first point in the sliding window
        startingPoint = datasets.length > 0 ? (sampleCount < MAX_VERTICES ? datasets[0] : datasets[datasets.length - MAX_VERTICES]) : { rpm: 0, tps: 0 };
        graphicsRef.moveTo(convertGraphToScreenX(startingPoint.tps), convertGraphToScreenY(startingPoint.rpm));

        let x = 0.0, y = 0.0;
        for (let i = 1; i < Math.min(sampleCount, MAX_VERTICES); i++) {
          let dataPoint = sampleCount < MAX_VERTICES ? datasets[i] : datasets[datasets.length - MAX_VERTICES + i];

          x = convertGraphToScreenX(dataPoint.tps);
          y = convertGraphToScreenY(dataPoint.rpm);

          particles[i].x = x;
          particles[i].y = y;
          particles[i].alpha = ((i + MAX_VERTICES - Math.min(sampleCount, MAX_VERTICES)) / MAX_VERTICES);
        }


        ///// Graph Box /////
        graphicsRef.rect(graphXMin, graphYMin, graphXMax - graphXMin, graphYMax - graphYMin);
        graphicsRef.stroke({ width: 2, color: 0x000000 });

        ///// Finish up /////
        graphicsRef.closePath();
      };



      ////////// Coordinate conversions //////////
      function convertGraphToScreenX(x: number): number {
        const dataRange = isFinite(xDataMax) && isFinite(xDataMin) && xDataMax !== xDataMin ? xDataMax - xDataMin : 1;
        const graphRange = isFinite(graphXMax) && isFinite(graphXMin) && graphXMax !== graphXMin ? graphXMax - graphXMin: 1;
        return (graphXMin + GRAPH_MARGIN) + (((x - xDataMin) / dataRange) * (graphRange - (2 * GRAPH_MARGIN)));
      }

      function convertGraphToScreenY(y: number): number {
        const dataRange = isFinite(yDataMax) && isFinite(yDataMin) && yDataMax !== yDataMin ? yDataMax - yDataMin : 1;
        const graphRange = isFinite(graphYMax) && isFinite(graphYMin) && graphYMax !== graphYMin ? graphYMax - graphYMin: 1;
        return (graphYMax - GRAPH_MARGIN) - (((y - yDataMin) / dataRange) * (graphRange - (2 * GRAPH_MARGIN)));
      }



      ////////// Handle resizing //////////
      resizeHandler = () => {
        const container = pixiContainerRef.current;
        const padding = parseInt(window.getComputedStyle(container).padding);
        windowSize = Math.min(container.clientWidth - (padding * 2), container.clientHeight - (padding * 2));

        app.renderer.resize(windowSize, windowSize);

        // Trigger rendering to update the scene
        app.render();
        draw();
      };

      // Resize the canvas initially
      resizeHandler();

      // Listen for window resize events
      window.addEventListener('resize', resizeHandler);

      // Append the application canvas to the document body
      const container = pixiContainerRef.current;
      if (container) container.appendChild((app.view as any) ?? (app as any).canvas);

      // Utilized to call the draw - 60fps
      const tickerCallback = () => {
        draw(); // Call the drawing function

        // Create new data state
        angle += 0.1; // Increment angle for data generation
        currentState = { data: {
          tps: Math.cos(angle) + 3 * Math.sin(angle/5),
          rpm: Math.sin(angle/3) + 3 * Math.sin(angle/4)
        } };
        datasets.push(currentState.data);

        sampleCount++;
      };
      app.ticker.add(tickerCallback);
    };

    initPixiApp();
    return () => {
      // Remove resize event listener
      window.removeEventListener('resize', resizeHandler);

      // Try to gracefully stop and destroy PIXI app if it exists
      try {
        const container = pixiContainerRef.current;

        // Find any PIXI view inside the container and remove/destroy
        if (container) {
          const view = container.querySelector('canvas');
          if (view) container.removeChild(view);
        }
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, []);


  return (
    <Layout>
      <header className={clsx(styles.headerBanner)}>
        <div className="container">
          <Heading as="h1" className="example_title">Dot Plot</Heading>
        </div>
      </header>
      <main style={{ display: 'flex' }}>
        <div className={styles.codeBlock}>
          <SyntaxHighlighter language="typescript" style={atomOneDark}>
            {`
TODO - show actual code (want to clean up first)
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            `}
          </SyntaxHighlighter>
        </div>
        <div className={styles.canvas} ref={pixiContainerRef} />
      </main>
    </Layout>
  );
}