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
  
  // Graph margin
  const leftMargin = 65;
  const bottomMargin = 50;

  // Graph ticks
  const numXTicks = 5;
  const xTickLength = 20;
  const yTickLength = 10;
  var xTickOffset = 0;
  const yTickInterval = 0.5;

  var datasets = [];
  var dataMax = -Infinity;
  var dataMin = Infinity;
  var angle = 0;
  const vertexCount = 100;
  var sampleCount = 0;
  
  useEffect(() => {
    const initPixiApp = async () => {
      var windowSize: number;
      
      // Create a new application
      const app = new Application();
      
      // Initialize the application
      await app.init({ background: '#FFFFFF', antialias: true });
      


      ////////// Draw function - called continuously (60fps) //////////
      const draw = () => {
        ///// Initialization /////

        // Reset the drawing at the beginning of every frame
        app.stage.removeChildren();
        const graphics = new Graphics();
        dataMax = -Infinity;
        dataMin = Infinity;
        
        // Resize the graph bounds to fit the shown points
        for (var i = 1; i < Math.min(sampleCount, vertexCount); i++) {
          var dataPoint = sampleCount < vertexCount ? datasets[i] : datasets[datasets.length - vertexCount + i];

          dataMax = Math.max(dataPoint, dataMax);
          dataMin = Math.min(dataPoint, dataMin);
        }

        // Update the drawing bounds
        const graphXMin = 0 + leftMargin;
        const graphYMin = 0;
        const graphXMax = windowSize;
        const graphYMax = windowSize - bottomMargin;

        // Draw the y-axis
        graphics.moveTo(leftMargin, 0);
        graphics.lineTo(leftMargin, windowSize - bottomMargin);
        graphics.stroke({ width: 2, color: 0x000000, alpha: 1 });
        
        // Draw the x-axis
        graphics.moveTo(leftMargin, windowSize - bottomMargin);
        graphics.lineTo(windowSize, windowSize - bottomMargin);
        graphics.stroke({ width: 2, color: 0x000000, alpha: 1 });


        ///// Tick lines /////

        // Prepare tick lines
        const xTickInterval = (graphXMax - leftMargin) / numXTicks;
        const numYTicks = Math.round((dataMax - dataMin) / yTickInterval) + 1;
        const firstYTick = (Math.round(dataMax / yTickInterval)) * yTickInterval;

        // Draw the X ticks and grid lines
        for (let i = 0; i < numXTicks; i++) {
          let x = (leftMargin) + i * xTickInterval - xTickOffset;
          x = x % (graphXMax - graphXMin);
          if (x < graphXMin)
            x = graphXMax + x;

          // Draw x-tick
          graphics.moveTo(x, graphYMax);
          graphics.lineTo(x, graphYMax + xTickLength / (i % 2 + 1));
          graphics.stroke({ width: 2, color: 0x000000, alpha: 1 });

          // Draw grid line for x
          graphics.moveTo(x, graphYMin);
          graphics.lineTo(x, graphYMax);
          graphics.stroke({ width: 2, color: 0x000000, alpha: 0.15 });
        }

        // Draw the Y ticks and grid lines
        for (let i = 0; i < numYTicks; i++) {
          // Get the next tick position
          let graphY = convertGraphToScreenY(firstYTick - (i * yTickInterval));
          if (graphY > graphYMax) continue; // Skip if out of bounds

          // Draw the tick line
          graphics.moveTo(graphXMin, graphY);
          graphics.lineTo(graphXMin - yTickLength, graphY);
          let graphRange = graphYMax - graphYMin;
          let dataRange = dataMax - dataMin;

          let normalizedGraphY = (graphYMax - (graphY - graphYMin)) / graphRange;
          let dataConvertedY = normalizedGraphY * dataRange + dataMin;

          if (Math.abs(dataConvertedY) < 0.001) dataConvertedY = 0;


          let yLabel = new Text({
            text: dataConvertedY.toFixed(2),
            x: leftMargin - yTickLength - 5,
            y: graphY,
            anchor: { x: 1, y: 0.5 }, // Right align, vertically centered
            style: {
              fontFamily: 'short-stack',
              fontSize: 18
            }
          });

          app.stage.addChild(yLabel);

          graphics.stroke({ width: 2, color: 0x000000, alpha: 1 });

          // Draw grid line for y
          graphics.moveTo(graphXMin, graphY);
          graphics.lineTo(graphXMax, graphY);


          graphics.stroke({ width: 2, color: 0x000000, alpha: 0.15 });
        }

        // Draw the midline
        if (convertGraphToScreenY(0) < graphYMax) {
          graphics.moveTo(leftMargin, convertGraphToScreenY(0));
          graphics.lineTo(graphXMax, convertGraphToScreenY(0));
        }


        ///// Plot points /////

        // Start the line from the first point in the sliding window
        const startingPoint = sampleCount < vertexCount ? datasets[0] : datasets[datasets.length - vertexCount];
        graphics.moveTo(leftMargin, convertGraphToScreenY(startingPoint));

        var x = 0.0, y = 0.0;
        for (var i = 1; i < Math.min(sampleCount, vertexCount); i++) {
          let dataPoint = sampleCount < vertexCount ? datasets[i] : datasets[datasets.length - vertexCount + i];

          x = convertGraphToScreenX(i);
          y = convertGraphToScreenY(dataPoint);

          graphics.circle(x, y, 1);
        }
        graphics.stroke({ width: 2, color: 0x000000, alpha: 1 });
        graphics.closePath();
        
        app.stage.addChild(graphics);
      };



      ////////// Coordinate conversions //////////
      function convertGraphToScreenX(x: number): number {
        return x * ((windowSize - leftMargin) / vertexCount) + leftMargin;
      }

      function convertGraphToScreenY(y: number): number {
        return (windowSize - bottomMargin) - (((y - dataMin) / (dataMax - dataMin)) * (windowSize - bottomMargin));
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
      pixiContainerRef.current.appendChild(app.canvas);

      // Utilized to call the draw - 60fps
      app.ticker.add(() => {

        draw();
        angle += 0.1
        // if (Math.sin(angle) > 0.99) datasets.push(1);
        // else if (Math.sin(angle) < -0.99) datasets.push(-1);
        // else datasets.push(Math.sin(angle));
        datasets.push(Math.sin(angle) + Math.sin(angle/5));

        sampleCount++;
        if (sampleCount > vertexCount)
          xTickOffset += (1 / (sampleCount < vertexCount ? sampleCount : vertexCount)) * (windowSize - leftMargin);


        // }
      });
    };

    initPixiApp();
    return () => {
      // Remove resize event listener
      window.removeEventListener('resize', resizeHandler);
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