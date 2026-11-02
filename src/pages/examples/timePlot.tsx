import { Application, Graphics, Particle, ParticleContainer, Text, Texture } from 'pixi.js';
import { JSX, useEffect, useRef } from 'react';
// SyntaxHighlighter removed; we display the graph centered instead
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../css/examples.module.css';
import { io, Socket } from 'socket.io-client';
import { Dataset } from '@site/src/models/telemetryModel';
import { ModelData, ModelDataType } from '@site/src/models/model';

var resizeHandler: EventListener | any;


interface Source {
  dataType: ModelDataType;
  selector: (d: ModelData) => number;
  color?: number;
  label?: string;
}

export default function TimePlot({
  sources = [{ dataType: ModelDataType.GPS, selector: (d: ModelData) => ((d as any).Latitude ?? 0), color: 0x000000, label: 'GPS' }],
  xLabel = 'Time',
  yLabel = 'Value',
  title = 'Time Plot',
  subtitle,
  inline = false,
}: {
  sources?: Source[];
  xLabel?: string;
  yLabel?: string;
  title?: string;
  subtitle?: string;
  inline?: boolean;
}): JSX.Element {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  var dataset: Dataset = new Dataset();

  // Graph bounds
  const LEFT_MARGIN = 90;
  const RIGHT_MARGIN = 25;
  const BOTTOM_MARGIN = 70;
  const TOP_MARGIN = 25;
  const GRAPH_MARGIN = 25;
  var canvasWidth = 0, canvasHeight = 0;
  var xDataMax = -Infinity, xDataMin = Infinity;
  var yDataMax = -Infinity, yDataMin = Infinity;
  var graphXMin = 0, graphXMax = 0;
  var graphYMin = 0, graphYMax = 0;
  
  // Graph tick spacing
  const CLEAN_SPACINGS = [10000, 5000, 2000, 1000, 500, 200, 100]; // ms candidates

  // Graph X ticks
  const X_TICK_LEN = 10;
  var xTickInterval = 0, xTargetSpacing = 0, xBasePower = 0, numXTicks = 0;
  
  // Graph Y ticks
  const Y_TICK_LEN = 10;
  var yTickInterval = 0, yTargetSpacing = 0, yBasePower = 0, numYTicks = 0;

  // Graph data
  const MAX_VERTICES = 1000;
  var startingPoint = { Timestamp: Date.now(), Latitude: 0 } as any;

  // Time window for X axis (ms)
  const TIME_WINDOW_MS = 15000; // 15 seconds
  
  useEffect(() => {
    let socket: Socket | null = null;

    socket = io('http://192.168.137.1:3001');
    socket.on('telemetry:history', (history: Dataset) => {
      dataset = Object.assign(new Dataset(), history);
    });

    socket.on('telemetry', (sample: ModelData) => {
      dataset.addDataPoint(sample, MAX_VERTICES);
    });

    const initPixiApp = async () => {
      // Local refs so cleanup can access them
      let appRef: Application | null = null;
      let graphicsRef: Graphics | null = null;
      const xLabelPool: Text[] = [];
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
    
      // Create plot point texture
      const pointGraphics: Graphics = new Graphics();
      pointGraphics.beginFill(0xffffff);
      pointGraphics.drawCircle(0, 0, 3);
      pointGraphics.endFill();
      const pointTex: Texture = app.renderer.generateTexture(pointGraphics);

      // Create per-source particle containers and particle pools
      const partContainers: ParticleContainer[] = [];
      const particlesBySource: Particle[][] = [];
      for (let s = 0; s < sources.length; s++) {
        const src = sources[s];
        const container: ParticleContainer = new ParticleContainer({ dynamicProperties: { position: true, color: true } });
        partContainers.push(container);
        app.stage.addChild(container);

        const srcParticles: Particle[] = [];
        for (let i = 0; i < MAX_VERTICES; i++) {
          const p: Particle = new Particle({ texture: pointTex, x: 0, y: 0, anchorX: 0.5, anchorY: 0.5 });
          // set initial tint and transparent alpha
          (p as any).tint = (src.color ?? 0x000000);
          p.alpha = 0;
          container.addParticle(p);
          srcParticles.push(p);
        }
        particlesBySource.push(srcParticles);
      }

      // Prepare a small pool of Y-label Text objects and reuse them every frame
      const MAX_AXIS_LABELS = 40; // reasonable upper bound for ticks
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
      const xAxisTitle = new Text(xLabel, { fontFamily: 'arial', fontSize: 18 });
      xAxisTitle.anchor = { x: 0.5, y: 1 };
      app.stage.addChild(xAxisTitle);
      
      // Y axis name
      const yAxisTitle = new Text(yLabel, { fontFamily: 'arial', fontSize: 18 });
      yAxisTitle.anchor = { x: 0.5, y: 0 };
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

        // Update axis positions (center relative to graph bounds)
        xAxisTitle.x = (graphXMin + graphXMax) / 2;
        xAxisTitle.y = canvasHeight - 10;
        yAxisTitle.x = 10;
        yAxisTitle.y = (graphYMin + graphYMax) / 2;
        
        // Determine latest timestamp across all sources
        let latestTimestamp = Date.now();
        for (const src of sources) {
          const arr = dataset.getSet(src.dataType) as ModelData[];
          if (arr && arr.length > 0) latestTimestamp = Math.max(latestTimestamp, (arr[arr.length - 1].Timestamp as number));
        }

        // Set X data bounds to a sliding window ending at latestTimestamp
        xDataMax = latestTimestamp;
        xDataMin = xDataMax - TIME_WINDOW_MS;

        // Compute Y bounds from current visible samples across all sources
        for (const src of sources) {
          const arr = dataset.getSet(src.dataType) as ModelData[];
          if (!arr) continue;
          const sampleCount = arr.length;
          for (let i = 0; i < Math.min(sampleCount, MAX_VERTICES); i++) {
            let idx = sampleCount < MAX_VERTICES ? i : sampleCount - MAX_VERTICES + i;
            const dataPoint: ModelData = arr[idx];
            if ((dataPoint.Timestamp as number) < xDataMin) continue;
            const val = src.selector(dataPoint);
            if (!isFinite(val)) continue;
            yDataMax = Math.max(val, yDataMax);
            yDataMin = Math.min(val, yDataMin);
          }
        }

        // Use the data min/max as bounds (fall back to defaults only if no data)
        if (!isFinite(yDataMin) || !isFinite(yDataMax)) {
          yDataMin = -2;
          yDataMax = 2;
        }

        // Add a small fractional padding around the Y data so points don't sit on the edges
        const PAD_FRACTION = 0.03; // 3% padding
        const rawYRange = (isFinite(yDataMax) && isFinite(yDataMin) && yDataMax !== yDataMin) ? (yDataMax - yDataMin) : 1;
        yDataMin -= rawYRange * PAD_FRACTION;
        yDataMax += rawYRange * PAD_FRACTION;
        
        // Update the drawing bounds
        graphXMin = LEFT_MARGIN;
        graphYMin = TOP_MARGIN;
        graphXMax = canvasWidth - RIGHT_MARGIN;
        graphYMax = canvasHeight - BOTTOM_MARGIN;
        
        
        ///// X Tick lines /////
        
        // Prepare X tick lines with guards to avoid NaN/Infinity
        const xDataRange = isFinite(xDataMax) && isFinite(xDataMin) && xDataMax !== xDataMin ? xDataMax - xDataMin : TIME_WINDOW_MS;
        xTargetSpacing = xDataRange / ((canvasWidth - LEFT_MARGIN - RIGHT_MARGIN) / 90.0); // wider spacing for time labels
        if (xTargetSpacing <= 0 || !isFinite(xTargetSpacing)) xTargetSpacing = 1000;
        // Pick a spacing candidate from CLEAN_SPACINGS (ms) by finding nearest >= target
        const xSpacingCandidate = CLEAN_SPACINGS.find(s => s >= xTargetSpacing) ?? CLEAN_SPACINGS[CLEAN_SPACINGS.length - 1];
        xTickInterval = xSpacingCandidate;

        numXTicks = Math.max(0, Math.round(xDataRange / xTickInterval) + 2);
        const firstXTick = Math.ceil(xDataMax / xTickInterval) * xTickInterval;
        
        // Draw the X ticks and grid lines (reuse pooled Text labels)
        for (let i = 0; i < numXTicks; i++) {
          // Get the next tick position
          let tickX = firstXTick - (i * xTickInterval);
          let graphX = convertGraphToScreenX(tickX);
          let isWithinBounds = (graphX <= graphXMax + 1 && graphX >= graphXMin - 1);

          // Check if even/odd tick line
          let isEvenTick = (i + Math.round(firstXTick / xTickInterval)) % 2 == 0;

          // Only draw if within bounds
          if (isWithinBounds) {
            // Draw the tick line
            graphicsRef.moveTo(graphX, canvasHeight - BOTTOM_MARGIN);
            graphicsRef.lineTo(graphX, canvasHeight - BOTTOM_MARGIN + (isEvenTick ? X_TICK_LEN : X_TICK_LEN / 2));
            graphicsRef.stroke({ width: 2, color: 0x000000 });
            
            // Draw grid line for x
            graphicsRef.moveTo(graphX, graphYMin);
            graphicsRef.lineTo(graphX, graphYMax);
            graphicsRef.stroke({ width: 2, color: 0x000000, alpha: isEvenTick ? 0x888888 : 0xDDDDDD });
          }

          // Draw the tick value using a pooled Text label
          const lbl = xLabelPool[i];
          if (lbl) {
            lbl.text = new Date(Math.round(tickX)).toLocaleTimeString();
            lbl.x = graphX;
            lbl.y = canvasHeight - (BOTTOM_MARGIN - X_TICK_LEN - 5);
            lbl.visible = isWithinBounds;
          }
          graphicsRef.stroke({ width: 2, color: 0x000000 });
        }
        // Hide any unused pooled labels
        for (let i = numXTicks; i < xLabelPool.length; i++) xLabelPool[i].visible = false;


        ///// Y Tick lines /////
        
        // Prepare Y tick lines with guards to avoid NaN/Infinity
        const yDataRange = isFinite(yDataMax) && isFinite(yDataMin) && yDataMax !== yDataMin ? yDataMax - yDataMin : 1;
        yTargetSpacing = yDataRange / ((canvasHeight - TOP_MARGIN - BOTTOM_MARGIN) / 45.0); // Split range based on screen size
        if (yTargetSpacing <= 0 || !isFinite(yTargetSpacing)) yTargetSpacing = 1;
        yBasePower = Math.pow(10, Math.floor(Math.log10(yTargetSpacing))); // Find decimal place of spacing
        const spacingCandidate = [1, 0.5, 0.2, 0.1].find(s => yBasePower / s >= yTargetSpacing) ?? 1;
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


        ///// Plot points /////

        // Plot points per source
        for (let s = 0; s < sources.length; s++) {
          const src = sources[s];
          const arr = dataset.getSet(src.dataType) as ModelData[];
          const srcParticles = particlesBySource[s];
          if (!arr || !srcParticles) continue;
          const sampleCount = arr.length;
          for (let i = 0; i < Math.min(sampleCount, MAX_VERTICES); i++) {
            let idx = sampleCount < MAX_VERTICES ? i : sampleCount - MAX_VERTICES + i;
            const dataPoint = arr[idx];
            if ((dataPoint.Timestamp as number) < xDataMin) {
              srcParticles[i].alpha = 0;
              continue;
            }

            const val = src.selector(dataPoint);
            if (!isFinite(val)) {
              srcParticles[i].alpha = 0;
              continue;
            }

            const x = convertGraphToScreenX(dataPoint.Timestamp as number);
            const y = convertGraphToScreenY(val);

            srcParticles[i].x = x;
            srcParticles[i].y = y;
            // fade older points
            const ageFactor = (dataPoint.Timestamp as number) - xDataMin;
            srcParticles[i].alpha = Math.max(0.05, Math.min(1, ageFactor / (xDataRange)));
            // set tint if provided
            if ((src.color ?? null) !== null) (srcParticles[i] as any).tint = src.color;
          }
        }


        ///// Graph Box /////
        graphicsRef.rect(graphXMin, graphYMin, graphXMax - graphXMin, graphYMax - graphYMin);
        graphicsRef.stroke({ width: 2, color: 0x000000 });

        ///// Finish up /////
        graphicsRef.closePath();
      };



      ////////// Coordinate conversions //////////
      function convertGraphToScreenX(x: number): number {
        const dataRange = isFinite(xDataMax) && isFinite(xDataMin) && xDataMax !== xDataMin ? xDataMax - xDataMin : TIME_WINDOW_MS;
        const graphRange = isFinite(graphXMax) && isFinite(graphXMin) && graphXMax !== graphXMin ? graphXMax - graphXMin: 1;
        return (graphXMin + GRAPH_MARGIN) + (((x - xDataMin) / dataRange) * (graphRange - (2 * GRAPH_MARGIN)));
      }

      function convertGraphToScreenY(y: number): number {
        const dataRange = isFinite(yDataMax) && isFinite(yDataMin) && yDataMax !== yDataMin ? yDataMax - yDataMin : 1;
        const graphRange = isFinite(graphYMax) && isFinite(graphYMin) && graphYMax !== graphYMin ? graphYMax - graphYMin: 1;
        return (graphYMax - GRAPH_MARGIN) - (((y - yDataMin) / dataRange) * (graphRange - (2 * GRAPH_MARGIN)));
      }



      // Append the application canvas to the document body
      const container = pixiContainerRef.current;
      if (container) container.appendChild((app.view as any) ?? (app as any).canvas);

      ////////// Handle resizing (simplified) //////////
      resizeHandler = () => {
        const container = pixiContainerRef.current;
        if (!container) return;

        // Use bounding rect for robust width/height and subtract padding to avoid overflow
        const rect = container.getBoundingClientRect();
        const style = window.getComputedStyle(container);
        const padLeft = parseFloat(style.paddingLeft || '0') || 0;
        const padRight = parseFloat(style.paddingRight || '0') || 0;
        const padTop = parseFloat(style.paddingTop || '0') || 0;
        const padBottom = parseFloat(style.paddingBottom || '0') || 0;

        const contentWidth = Math.max(100, Math.round((rect.width || 0) - (padLeft + padRight)));
        const contentHeight = Math.max(100, Math.round((rect.height || 0) - (padTop + padBottom)));

        canvasWidth = contentWidth;
        canvasHeight = contentHeight;

        app.renderer.resize(canvasWidth, canvasHeight);

        const canvasEl = (app.view as any) as HTMLCanvasElement;
        if (canvasEl && canvasEl.style) {
          canvasEl.style.width = `${canvasWidth}px`;
          canvasEl.style.height = `${canvasHeight}px`;
          canvasEl.style.display = 'block';
          canvasEl.style.margin = '0 auto';
        }

        // Render once after resizing
        app.render();
        draw();
      };

      // Initial size and listener
      resizeHandler();
      window.addEventListener('resize', resizeHandler);

      // Utilized to call the draw - 60fps
      const tickerCallback = () => {
        draw(); // Call the drawing function
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

      if (socket) {
        socket.disconnect();
      }
    };
  }, []);


  if (inline) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className={styles.canvas} ref={pixiContainerRef} />
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <header className={clsx(styles.headerBanner)}>
        <div className="container">
          <Heading as="h1" className="example_title">{title}</Heading>
          {subtitle ? <p style={{ marginTop: 8 }}>{subtitle}</p> : null}
        </div>
      </header>
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className={styles.canvas} ref={pixiContainerRef} />
        </div>
      </main>
    </Layout>
  );
}
