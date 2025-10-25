import { Application, Graphics, mapFormatToGlInternalFormat, Text } from 'pixi.js';
import { JSX, useEffect, useRef } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../css/examples.module.css';

var resizeHandler: EventListener | any;

export default function DotPlot(): JSX.Element {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  
  // Graph bounds
  const leftMargin = 65;
  const bottomMargin = 50;
  var windowSize: number;
  var dataMax = -Infinity;
  var dataMin = Infinity;

  // Graph X ticks
  const numXTicks = 5;
  const xTickLength = 20;
  var xTickInterval = 0, xTickOffset = 0;
  
  // Graph Y ticks
  const yCleanSpacings = [1, 0.4, 0.2, 0.1];
  const yTickLength = 10;
  var yTickInterval = 0, yTargetSpacing = 0, basePower = 0, numYTicks = 0;

  // Graph data
  const maxVertices = 100;
  var datasets = [];
  var startingPoint = 0;
  var angle = 0;
  var sampleCount = 0;
  
  useEffect(() => {
    const initPixiApp = async () => {
      // Local refs so cleanup can access them
      let appRef: Application | null = null;
      let graphicsRef: Graphics | null = null;
      const yLabelPool: Text[] = [];
      let createdTexts = 0;
      let createdGraphics = 0;

      // Create a new application
      const app = new Application();
      appRef = app;
      
      // Initialize the application
      await app.init({ background: '#FFFFFF', antialias: true });

      // Create and reuse a single Graphics instance (or a small set of layers)
      graphicsRef = new Graphics();
      createdGraphics++;
      app.stage.addChild(graphicsRef);

      // Prepare a small pool of Y-label Text objects and reuse them every frame
      const maxYLabelPool = 48; // reasonable upper bound for ticks
      for (let i = 0; i < maxYLabelPool; i++) {
        const lbl = new Text('', { fontFamily: 'short-stack', fontSize: 18 });
        lbl.anchor = { x: 1, y: 0.5 } as any;
        lbl.visible = false;
        app.stage.addChild(lbl);
        yLabelPool.push(lbl);
        createdTexts++;
      }

      ////////// Draw function - called continuously (60fps) //////////
      const draw = () => {
        ///// Initialization /////

        if (!graphicsRef) return;

        // Reuse graphics: clear instead of creating/destroying every frame
        graphicsRef.clear();
        dataMax = -Infinity;
        dataMin = Infinity;
        
        // Resize the graph bounds to fit the shown points
        for (let i = 1; i < Math.min(sampleCount, maxVertices); i++) {
          let dataPoint = sampleCount < maxVertices ? datasets[i] : datasets[datasets.length - maxVertices + i];
          
          dataMax = Math.max(dataPoint, dataMax);
          dataMin = Math.min(dataPoint, dataMin);
        }
        
        // Update the drawing bounds
        const graphXMin = 0 + leftMargin;
        const graphYMin = 0;
        const graphXMax = windowSize;
        const graphYMax = windowSize - bottomMargin;
        
        
        ///// X Tick lines /////
        
        // Prepare X tick lines
        xTickInterval = (graphXMax - leftMargin) / numXTicks;
        
        // Draw the X ticks and grid lines
        for (let i = 0; i < numXTicks; i++) {
          let x = (leftMargin) + i * xTickInterval - xTickOffset;
          x = x % (graphXMax - graphXMin);
          if (x < graphXMin)
            x = graphXMax + x;
          
          // Draw X tick
          graphicsRef.moveTo(x, graphYMax);
          graphicsRef.lineTo(x, graphYMax + xTickLength / (i % 2 + 1));
          graphicsRef.stroke({ width: 2, color: 0x000000 });
          
          // Draw grid line for X
          graphicsRef.moveTo(x, graphYMin);
          graphicsRef.lineTo(x, graphYMax);
          graphicsRef.stroke({ width: 2, color: 0xCCCCCC });
        }


        ///// Y Tick lines /////
        
        // Prepare Y tick lines with guards to avoid NaN/Infinity
        const dataRange = isFinite(dataMax) && isFinite(dataMin) && dataMax !== dataMin ? dataMax - dataMin : 1;
        yTargetSpacing = dataRange / 10.0; // Split range into roughly 5-10 ticks
        if (yTargetSpacing <= 0 || !isFinite(yTargetSpacing)) yTargetSpacing = 1;
        basePower = Math.pow(10, Math.floor(Math.log10(yTargetSpacing))); // Find decimal place of spacing
        const spacingCandidate = yCleanSpacings.find(s => basePower / s >= yTargetSpacing) ?? 1;
        yTickInterval = basePower / spacingCandidate; // Round to clean interval (1, 0.5, 0.25, 0.1)

        numYTicks = Math.max(0, Math.round(dataRange / yTickInterval) + 1);
        const firstYTick = (Math.round(dataMax / yTickInterval)) * yTickInterval;
        
        // Draw the Y ticks and grid lines (reuse pooled Text labels)
        for (let i = 0; i < numYTicks; i++) {
          // Get the next tick position
          let tickY = firstYTick - (i * yTickInterval);
          let graphY = convertGraphToScreenY(tickY);
          if (graphY > graphYMax) continue; // Skip if out of bounds

          // Check if even/odd tick line
          let isEvenTick = (i + (firstYTick / yTickInterval)) % 2 == 0;

          // Draw the tick line
          graphicsRef.moveTo(graphXMin, graphY);
          graphicsRef.lineTo(graphXMin - (isEvenTick ? yTickLength : yTickLength / 2), graphY);

          // Draw the tick value using a pooled Text label
          const lbl = yLabelPool[i];
          if (lbl) {
            lbl.text = tickY.toFixed(2);
            lbl.x = leftMargin - yTickLength - 5;
            lbl.y = graphY;
            lbl.visible = true;
          }
          graphicsRef.stroke({ width: 2, color: 0x000000 });
          
          // Draw grid line for y
          graphicsRef.moveTo(graphXMin, graphY);
          graphicsRef.lineTo(graphXMax, graphY);
          graphicsRef.stroke({ width: 2, color: isEvenTick ? 0x888888 : 0xDDDDDD });
        }
        // Hide any unused pooled labels
        for (let i = numYTicks; i < yLabelPool.length; i++) yLabelPool[i].visible = false;
        
        // Draw the midline
        if (convertGraphToScreenY(0) < graphYMax) {
          graphicsRef.moveTo(leftMargin, convertGraphToScreenY(0));
          graphicsRef.lineTo(graphXMax, convertGraphToScreenY(0));
          graphicsRef.stroke({ width: 3, color: 0x000000 });
        }


        ///// Plot points /////

        // Start the line from the first point in the sliding window
        startingPoint = datasets.length > 0 ? (sampleCount < maxVertices ? datasets[0] : datasets[datasets.length - maxVertices]) : 0;
        graphicsRef.moveTo(leftMargin, convertGraphToScreenY(startingPoint));

        let x = 0.0, y = 0.0;
        for (let i = 1; i < Math.min(sampleCount, maxVertices); i++) {
          let dataPoint = sampleCount < maxVertices ? datasets[i] : datasets[datasets.length - maxVertices + i];

          x = convertGraphToScreenX(i);
          y = convertGraphToScreenY(dataPoint);

          graphicsRef.circle(x, y, 1);
        }
        graphicsRef.stroke({ width: 2, color: 0x000000 });


        ///// Axis lines /////

        // Draw the y-axis
        graphicsRef.moveTo(leftMargin, 0);
        graphicsRef.lineTo(leftMargin, windowSize - bottomMargin);
        graphicsRef.stroke({ width: 2, color: 0x000000 });
              
        // Draw the x-axis
        graphicsRef.moveTo(leftMargin, windowSize - bottomMargin);
        graphicsRef.lineTo(windowSize, windowSize - bottomMargin);
        graphicsRef.stroke({ width: 2, color: 0x000000 });


        ///// Finish up /////
        graphicsRef.closePath();
      };



      ////////// Coordinate conversions //////////
      function convertGraphToScreenX(x: number): number {
        return x * ((windowSize - leftMargin) / maxVertices) + leftMargin;
      }

      function convertGraphToScreenY(y: number): number {
        const dataRange = isFinite(dataMax) && isFinite(dataMin) && dataMax !== dataMin ? dataMax - dataMin : 1;
        return (windowSize - bottomMargin) - (((y - dataMin) / dataRange) * (windowSize - bottomMargin));
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

        angle += 0.1; // Increment angle for data generation
        datasets.push(Math.sin(angle) + 3 * Math.sin(angle/5));
        if (datasets.length > maxVertices) datasets.shift(); // Remove excess data

        sampleCount++;
        if (sampleCount > maxVertices)
          xTickOffset += (1 / (sampleCount < maxVertices ? sampleCount : maxVertices)) * (windowSize - leftMargin);
      };
      app.ticker.add(tickerCallback);
    };

    initPixiApp();
    return () => {
      // Remove resize event listener
      window.removeEventListener('resize', resizeHandler);

      // Try to gracefully stop and destroy PIXI app if it exists
      try {
        // app was created inside initPixiApp. If still present on the stage, stop/destroy it.
        // We access the global PIXI application via the stage children if needed.
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