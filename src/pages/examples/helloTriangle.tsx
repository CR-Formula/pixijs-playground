import { Application, Graphics } from 'pixi.js';
import { useEffect, useRef } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../css/examples.module.css';

var resizeHandler : EventListener | any;

export default function HelloTriangle(): JSX.Element {
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
      
        // Triangle
        graphics.moveTo(windowSize / 2, windowSize / 10);
        graphics.lineTo(windowSize / 10, windowSize * 9 / 10);
        graphics.lineTo(windowSize * 9 / 10, windowSize * 9 / 10);
        graphics.lineTo(windowSize / 2, windowSize / 10);
        graphics.fill(0xff0000);
        graphics.stroke({ width: 4, color: 0x000000 });

        graphics.closePath();
          
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
          <Heading as="h1" className="example_title">Hello Triangle</Heading>
        </div>
      </header>
      <main style={{ display: 'flex'}}>
        <div className={styles.codeBlock}>
        <SyntaxHighlighter language="typescript" style={atomOneDark}>
            {`
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
  
    // Triangle
    graphics.moveTo(windowSize / 2, windowSize / 10);
    graphics.lineTo(windowSize / 10, windowSize * 9 / 10);
    graphics.lineTo(windowSize * 9 / 10, windowSize * 9 / 10);
    graphics.lineTo(windowSize / 2, windowSize / 10);
    graphics.fill(0xff0000);
    graphics.stroke({ width: 4, color: 0x000000 });

    graphics.closePath();
          
    app.stage.addChild(graphics);
  };

  // Function to handle resizing
  resizeHandler = () => {
    windowSize = Math.min(window.innerWidth, window.innerHeight) / 2;
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