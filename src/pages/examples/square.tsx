import { Application, Graphics } from 'pixi.js';
import { useEffect, useRef } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../css/examples.module.css';

var resizeHandler : EventListener | any;

export default function square(): JSX.Element {
    const pixiContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initPixiApp = async () => {
            var windowSize : number;

            // Create a new application
            const app = new Application();

            // Initialize the application
            await app.init({ background:'#00FFFF', antialias: true });

            const draw = () => {
                app.stage.removeChildren();
                const graphics = new Graphics();

                graphics.moveTo(windowSize / 8, windowSize / 8);
                graphics.lineTo(windowSize - (windowSize / 8), (windowSize / 8));
                graphics.lineTo(windowSize - (windowSize / 8), windowSize - (windowSize / 8));
                graphics.lineTo((windowSize / 8), windowSize - (windowSize / 8));
                graphics.lineTo((windowSize / 8), (windowSize / 8));
                graphics.fill(0x7285A5)
                graphics.stroke({ width: 4, color: 0x000000 });

                graphics.closePath();

                graphics.moveTo(windowSize / 3, windowSize / 8);
                graphics.lineTo(windowSize - (windowSize / 3), (windowSize / 8));
                graphics.lineTo(windowSize - (windowSize / 3), windowSize - (windowSize / 8));
                graphics.lineTo((windowSize / 3), windowSize - (windowSize / 8));
                graphics.lineTo((windowSize / 3), (windowSize / 8));
                graphics.fill(0x000000)
                graphics.stroke({ width: 4, color: 0x000000 });

                graphics.closePath();

                graphics.moveTo(windowSize / 8, windowSize / 3);
                graphics.lineTo(windowSize - (windowSize / 8), (windowSize / 3));
                graphics.lineTo(windowSize - (windowSize / 8), windowSize - (windowSize / 3));
                graphics.lineTo((windowSize / 8), windowSize - (windowSize / 3));
                graphics.lineTo((windowSize / 8), (windowSize / 3));
                graphics.fill(0x000000)
                graphics.stroke({ width: 4, color: 0x000000 });

                graphics.closePath();

                graphics.moveTo(windowSize / 2, windowSize / 8);
                graphics.lineTo((windowSize / 2), windowSize - (windowSize / 8));
                graphics.moveTo(windowSize / 8, windowSize / 2);
                graphics.lineTo(windowSize - (windowSize / 8), (windowSize / 2))
                graphics.stroke({ width: 4, color: 0xFF0000 });

                graphics.closePath();

                graphics.moveTo(windowSize / 8, windowSize / 8);
                graphics.lineTo(windowSize - (windowSize / 8), windowSize - (windowSize / 8));
                graphics.moveTo(windowSize - (windowSize / 8), windowSize / 8);
                graphics.lineTo((windowSize / 8), windowSize - (windowSize / 8))
                graphics.stroke({ width: 4, color: 0x0000FF });

                graphics.closePath();

                graphics.moveTo(windowSize / 2, windowSize / 4);
                graphics.lineTo(windowSize - (windowSize / 4), (windowSize / 2));
                graphics.lineTo(windowSize - (windowSize / 2), windowSize - (windowSize / 4));
                graphics.lineTo((windowSize / 4), windowSize - (windowSize / 2));
                graphics.lineTo((windowSize / 2), (windowSize / 4));
                graphics.fill(0xFF00FF)
                graphics.stroke({ width: 4, color: 0x000000 });

                graphics.closePath();

                graphics.circle(windowSize / 2, windowSize / 2, 20);
                graphics.fill(0x00FF00)
                graphics.stroke({ width: 4, color: 0x000000 });

                graphics.closePath();

                app.stage.addChild(graphics);
            };

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

            }
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
              <Heading as="h1" className="example_title">Square</Heading>
            </div>
          </header>
          <main style={{ display: 'flex'}}>
            <div className={styles.codeBlock}>
            <SyntaxHighlighter language="typescript" style={atomOneDark}>
                {`
    const initPixiApp = async () => {
            var windowSize : number;

            // Create a new application
            const app = new Application();

            // Initialize the application
            await app.init({ background:'#00FFFF', antialias: true });

            const draw = () => {
                app.stage.removeChildren();
                const graphics = new Graphics();

                graphics.moveTo(windowSize / 8, windowSize / 8);
                graphics.lineTo(windowSize - (windowSize / 8), (windowSize / 8));
                graphics.lineTo(windowSize - (windowSize / 8), windowSize - (windowSize / 8));
                graphics.lineTo((windowSize / 8), windowSize - (windowSize / 8));
                graphics.lineTo((windowSize / 8), (windowSize / 8));
                graphics.fill(0x7285A5)
                graphics.stroke({ width: 4, color: 0x000000 });

                graphics.closePath();

                graphics.moveTo(windowSize / 3, windowSize / 8);
                graphics.lineTo(windowSize - (windowSize / 3), (windowSize / 8));
                graphics.lineTo(windowSize - (windowSize / 3), windowSize - (windowSize / 8));
                graphics.lineTo((windowSize / 3), windowSize - (windowSize / 8));
                graphics.lineTo((windowSize / 3), (windowSize / 8));
                graphics.fill(0x000000)
                graphics.stroke({ width: 4, color: 0x000000 });

                graphics.closePath();

                graphics.moveTo(windowSize / 8, windowSize / 3);
                graphics.lineTo(windowSize - (windowSize / 8), (windowSize / 3));
                graphics.lineTo(windowSize - (windowSize / 8), windowSize - (windowSize / 3));
                graphics.lineTo((windowSize / 8), windowSize - (windowSize / 3));
                graphics.lineTo((windowSize / 8), (windowSize / 3));
                graphics.fill(0x000000)
                graphics.stroke({ width: 4, color: 0x000000 });

                graphics.closePath();

                graphics.moveTo(windowSize / 2, windowSize / 8);
                graphics.lineTo((windowSize / 2), windowSize - (windowSize / 8));
                graphics.moveTo(windowSize / 8, windowSize / 2);
                graphics.lineTo(windowSize - (windowSize / 8), (windowSize / 2))
                graphics.stroke({ width: 4, color: 0xFF0000 });

                graphics.closePath();

                graphics.moveTo(windowSize / 8, windowSize / 8);
                graphics.lineTo(windowSize - (windowSize / 8), windowSize - (windowSize / 8));
                graphics.moveTo(windowSize - (windowSize / 8), windowSize / 8);
                graphics.lineTo((windowSize / 8), windowSize - (windowSize / 8))
                graphics.stroke({ width: 4, color: 0x0000FF });

                graphics.closePath();

                graphics.moveTo(windowSize / 2, windowSize / 4);
                graphics.lineTo(windowSize - (windowSize / 4), (windowSize / 2));
                graphics.lineTo(windowSize - (windowSize / 2), windowSize - (windowSize / 4));
                graphics.lineTo((windowSize / 4), windowSize - (windowSize / 2));
                graphics.lineTo((windowSize / 2), (windowSize / 4));
                graphics.fill(0xFF00FF)
                graphics.stroke({ width: 4, color: 0x000000 });

                graphics.closePath();

                graphics.circle(windowSize / 2, windowSize / 2, 20);
                graphics.fill(0x00FF00)
                graphics.stroke({ width: 4, color: 0x000000 });

                graphics.closePath();

                app.stage.addChild(graphics);
            };

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

            }
            initPixiApp();
            return () => {
                // Remove resize event listener
                window.removeEventListener('resize', resizeHandler);
            };
            }
                `}
              </SyntaxHighlighter>
            </div>
            <div className={styles.canvas} ref={pixiContainerRef}/>
          </main>
        </Layout>
      );
}