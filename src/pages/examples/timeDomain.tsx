import { Application, Graphics, mapFormatToGlInternalFormat, Text } from 'pixi.js';
import { useEffect, useRef } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../css/examples.module.css';

var resizeHandler: EventListener | any;

export default function MovingLine(): JSX.Element {
  const pixiContainerRef = useRef<HTMLDivElement>(null);

  const leftMargin = 50;
  const bottomMargin = 50;

  var datasets = [];
  var dataMax = -Infinity;
  var dataMin = Infinity;
  var angle = 0;
  var vertexCount = 100;
  var sampleCount = 0
  var xTickOffset = 0;
  var dataMax = -Infinity;
  var dataMin = Infinity;

  useEffect(() => {
    const initPixiApp = async () => {
      var windowSize: number;

      // Create a new application
      const app = new Application();

      // Initialize the application
      await app.init({ background: '#FFFFFF', antialias: true });
      // Draw function - necessary for resizing
      var timeOut = 0;
      // Label must be declared outside of draw to persist between redraws
      const label = new Text({
        text: '',
        style: {
          fontFamily: 'short-stack'
        }
      });

      const draw = () => {

        app.stage.removeChildren();
        const graphics = new Graphics();



        for (var i = 1; i < Math.min(sampleCount, vertexCount); i++) {
          var dataPoint = sampleCount < vertexCount ? datasets[i] : datasets[datasets.length - vertexCount + i];

          dataMax = Math.max(dataPoint, dataMax);
          dataMin = Math.min(dataPoint, dataMin);
        }

        const graphXMin = 0 + leftMargin;
        const graphYMin = 0;
        // 186
        const graphXMax = windowSize;
        const graphYMax = windowSize - bottomMargin;

        const numXTicks = 5;


        graphics.moveTo(leftMargin, 0);
        graphics.lineTo(leftMargin, windowSize - bottomMargin);

        graphics.moveTo(leftMargin, windowSize - bottomMargin);
        graphics.lineTo(windowSize, windowSize - bottomMargin);


        graphics.stroke({ width: 2, color: 0x000000, alpha: 1 });

        const xTickLength = 20;  
        const numYTicks = 5;
        const yTickLength = 10; 

        const xTickInterval = (graphXMax - leftMargin) / numXTicks;
        const yTickInterval = (graphYMax) / (numYTicks);

        const yMidPoint = Math.floor(numYTicks / 2 + 1);
        // Centers the middle Y tick
        const yTickOffset = Math.abs(((graphYMax) / 2) - (yMidPoint * yTickInterval));

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
          let graphY = graphYMin + (i * yTickInterval) + yTickOffset;

          graphics.moveTo(graphXMin, graphY);
          graphics.lineTo(graphXMin - yTickLength / (i % 2 + 1), graphY);
          let graphRange = graphYMax - graphYMin;
          let dataRange = dataMax - dataMin;

          let normalizedGraphY = (graphYMax - (graphY - graphYMin)) / graphRange;
          let dataConvertedY = normalizedGraphY * dataRange + dataMin;

          if (Math.abs(dataConvertedY) < 0.001) dataConvertedY = 0;


          // let text = (graphYMax - (graphY - graphYMin)) / (graphYMax - graphYMin) * (dataMax - dataMin) + dataMin;
          let yLabel = new Text({
            text: dataConvertedY.toFixed(2),
            x: 25,
            y: graphY,
            style: {
              fontFamily: 'short-stack',
              fontSize: 24
            }
          });

          app.stage.addChild(yLabel);

          graphics.stroke({ width: 2, color: 0x000000, alpha: 1 });

          // Draw grid line for y
          graphics.moveTo(graphXMin, graphY);
          graphics.lineTo(graphXMax, graphY);


          graphics.stroke({ width: 2, color: 0x000000, alpha: 0.15 });
        }

        // Start the line from the first point in the sliding window
        const startingPoint = sampleCount < vertexCount ? datasets[0] : datasets[datasets.length - vertexCount];
        graphics.moveTo(50, graphYMax - (((startingPoint - dataMin) / (dataMax - dataMin)) * (graphYMax)));

        var x: number, y: number;
        for (var i = 1; i < Math.min(sampleCount, vertexCount); i++) {
          let dataPoint = sampleCount < vertexCount ? datasets[i] : datasets[datasets.length - vertexCount + i];

          x = i * ((windowSize - leftMargin) / vertexCount) + leftMargin;
          y = (((dataPoint - dataMin) / (dataMax - dataMin)) * (graphYMax));
          // Flip Y values to increase as vertical height on the canvas increases
          console.log("Max Y: " + graphYMax);
          
          console.log("Pre scale: " + y);
          y = graphYMax - y;
          console.log("Post scale: " + y);

          graphics.lineTo(x, y);
        }
        graphics.stroke({ width: 2, color: 0x000000, alpha: 1 });
        graphics.closePath();
        

        const coord = x + " " + y;
        console.log("coord: " + y);
        if (timeOut > 19) {
          timeOut = 0;
          label.text = coord;

          label.y = y;
        }
        timeOut += 1;

        label.x = 100;


        app.stage.addChild(label);
        app.stage.addChild(graphics);
      };

      // Function to handle resizing
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
        if (Math.sin(angle) > 0.99) datasets.push(1);
        else if (Math.sin(angle) < -0.99) datasets.push(-1);
        else datasets.push(Math.sin(angle));

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
          <Heading as="h1" className="example_title">Moving Line</Heading>
        </div>
      </header>
      <main style={{ display: 'flex' }}>
        <div className={styles.codeBlock}>
          <SyntaxHighlighter language="typescript" style={atomOneDark}>
            {`
export default function MovingLine(): JSX.Element {
  const pixiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPixiApp = async () => {
      var windowSize : number;

      // Create a new application
      const app = new Application();

      // Initialize the application
      await app.init({ background:'#FFFFFF', antialias: true });

      // Draw function - necessary for resizing
      const draw = () => {
        app.stage.removeChildren();
        const graphics = new Graphics();

        const min = 10;
        const max = 100;
        const vertexCount : number = Math.floor(Math.random() * (max - min + 1)) + min;
      
        // Random line with random amount of verticies of 10-100
        graphics.moveTo(windowSize / 10, windowSize / 2);
        for (var i = 1; i < vertexCount; i++) {
          const x = i * ((windowSize - (windowSize / 5)) / (vertexCount - 1)) + windowSize / 10;
          const minY = windowSize / 10;
          const maxY = windowSize - (windowSize / 5);
          const y : number = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
          graphics.lineTo(x, y);
        }
        graphics.stroke({ width: 2, color: 0x000000 });
          
        app.stage.addChild(graphics);
      };

      // Function to handle resizing
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
      });
    };

  initPixiApp();
  return () => {
    // Remove resize event listener
    window.removeEventListener('resize', resizeHandler);
  };
  }, []);
            `}
          </SyntaxHighlighter>
        </div>
        <div className={styles.canvas} ref={pixiContainerRef} />
      </main>
    </Layout>
  );
}