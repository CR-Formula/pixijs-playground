import { Application, Graphics, GraphicsContext, ObservablePoint } from 'pixi.js';
import { useEffect, useRef } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../css/examples.module.css';

var resizeHandler : EventListener | any;

export default function Wheel(): JSX.Element {
  const pixiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPixiApp = async () => {
      var windowSize : number;
      var angle = 0;
      // Create a new application
      const app = new Application();

      // Initialize the application
      await app.init({ background:'#FFFFFF', antialias: true });

    
      // Draw function - necessary for resizing
      const draw = () => {
        const graphics = new Graphics();
        app.stage.removeChildren();
        
        graphics.resetTransform();
        graphics.translateTransform(windowSize / 2, windowSize / 2);

        // Variable
        var radius = windowSize * 2 / 5;
        // Draws outer circle
        graphics.circle(0, 0, (radius * 15 / 14));
        
        // Draws inner circle
        graphics.circle(0, 0, radius);

        // Draws spokes
            //left to right
        graphics.moveTo(radius * Math.cos(angle), radius * Math.sin(angle));
        graphics.lineTo(-radius * Math.cos(angle), -radius * Math.sin(angle));
            //bottom to up
        graphics.moveTo(radius * Math.cos(angle + (Math.PI / 2)), radius * Math.sin(angle + (Math.PI / 2)));
        graphics.lineTo(-radius * Math.cos(angle + (Math.PI / 2)), -radius * Math.sin(angle + (Math.PI / 2)));
            //top right to bottom left
        graphics.moveTo(radius * Math.cos(angle + (Math.PI / 4)), radius * Math.sin(angle + (Math.PI / 4)));
        graphics.lineTo(-radius * Math.cos(angle + (Math.PI / 4)), -radius * Math.sin(angle + (Math.PI / 4)));
            //top left to bottom right
        graphics.moveTo(radius * Math.cos(angle + (3 * Math.PI / 4)), radius * Math.sin(angle + (3 * Math.PI / 4)));
        graphics.lineTo(-radius * Math.cos(angle + (3 * Math.PI / 4)), -radius * Math.sin(angle + (3 * Math.PI / 4)));

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

      // Utilized to call the draw - 60fps
      app.ticker.add((time) => {
        angle += 0.1 * time.deltaTime;
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
          <Heading as="h1" className="example_title">Wheel</Heading>
        </div>
      </header>
      <main style={{ display: 'flex'}}>
        <div className={styles.codeBlock}>
          <SyntaxHighlighter language="typescript" style={atomOneDark}>
            {`
export default function Wheel(): JSX.Element {
    const pixiContainerRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const initPixiApp = async () => {
        var windowSize : number;
        var angle = 0;
        // Create a new application
        const app = new Application();
  
        // Initialize the application
        await app.init({ background:'#FFFFFF', antialias: true });
  
      
        // Draw function - necessary for resizing
        const draw = () => {
          const graphics = new Graphics();
          app.stage.removeChildren();
          
          graphics.resetTransform();
          graphics.translateTransform(windowSize / 2, windowSize / 2);
  
          // Variable
          var radius = windowSize * 2 / 5;
          // Draws outer circle
          graphics.circle(0, 0, (radius * 15 / 14));
          
          // Draws inner circle
          graphics.circle(0, 0, radius);
  
          // Draws spokes
              //left to right
          graphics.moveTo(radius * Math.cos(angle), radius * Math.sin(angle));
          graphics.lineTo(-radius * Math.cos(angle), -radius * Math.sin(angle));
              //bottom to up
          graphics.moveTo(radius * Math.cos(angle + (Math.PI / 2)), radius * Math.sin(angle + (Math.PI / 2)));
          graphics.lineTo(-radius * Math.cos(angle + (Math.PI / 2)), -radius * Math.sin(angle + (Math.PI / 2)));
              //top right to bottom left
          graphics.moveTo(radius * Math.cos(angle + (Math.PI / 4)), radius * Math.sin(angle + (Math.PI / 4)));
          graphics.lineTo(-radius * Math.cos(angle + (Math.PI / 4)), -radius * Math.sin(angle + (Math.PI / 4)));
              //top left to bottom right
          graphics.moveTo(radius * Math.cos(angle + (3 * Math.PI / 4)), radius * Math.sin(angle + (3 * Math.PI / 4)));
          graphics.lineTo(-radius * Math.cos(angle + (3 * Math.PI / 4)), -radius * Math.sin(angle + (3 * Math.PI / 4)));
  
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
  
        // Utilized to call the draw - 60fps
        app.ticker.add((time) => {
          angle += 0.1 * time.deltaTime;
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