import { Application, Graphics } from 'pixi.js';
import { useEffect, useRef } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../css/examples.module.css';

var resizeHandler : EventListener | any;

export default function MovingLine(): JSX.Element {
  const pixiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPixiApp = async () => {
      var windowSize : number;
      var loadingProgress = 1 / 10;
      
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

        // Draw loading bar
        const loadingBarWidth = windowSize - (windowSize / 5);
        const loadingBarHeight = windowSize / 5;
        const loadingBarY = windowSize - (windowSize / 10);
        const loadingBarColor = 0x00ff00; // Green color for loaded part of the bar
        const loadingBarBgColor = 0xff0000; // Red color for remaining part of the bar
        

        const loadingBarGraphics = new Graphics();
        loadingBarGraphics.moveTo(windowSize / 10, windowSize - windowSize / 10);
        loadingBarGraphics.lineTo(loadingProgress * windowSize, loadingBarY);
        
        loadingBarGraphics.stroke({ width: 2, color: 0x000000 });

        app.ticker.add(() => {
          loadingProgress += 0.0001; 
        });
          
        app.stage.addChild(graphics);
        app.stage.addChild(loadingBarGraphics);
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
    

  return (
    <Layout>
      <header className={clsx(styles.headerBanner)}>
        <div className="container">
          <Heading as="h1" className="example_title">Moving Line</Heading>
        </div>
      </header>
      <main style={{ display: 'flex'}}>
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
        <div className={styles.canvas} ref={pixiContainerRef}/>
      </main>
    </Layout>
  );
}