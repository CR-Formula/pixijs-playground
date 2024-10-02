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
            var vertices : number[] = [];
            var originX : number;
            var originY : number;
            var radius : number;

            // Create a new application
            const app = new Application();

            // Initialize the application
            await app.init({ background:'#00FFFF', antialias: true });

            // Find New Vertices
            const setVertices = () => {
                var newVertices : number[] = [];
                var increment = Math.PI / 250;

                for (var angle = 0; angle < Math.PI; angle += increment) {
                    var x = originX + Math.cos(angle) * radius;
                    var y = originY + -1 * Math.sin(angle) * radius;
                    newVertices = [...newVertices, x, y];
                }

                return newVertices;
            };

            const draw = () => {
                app.stage.removeChildren();
                const graphics = new Graphics();

                graphics.moveTo(originX, originY);
                for (var i = 0; i < vertices.length; i += 2) {
                    var x = vertices[i];
                    var y = vertices[i+1];
                    graphics.lineTo(x,y);
                }

                graphics.lineTo(originX, originY);
                graphics.closePath();

                graphics.fill(0x7285A5);
                graphics.stroke({ width: 2, color: 0xFF0000 });

                app.stage.addChild(graphics);
            };


            resizeHandler = () => {
                const container = pixiContainerRef.current;
                const padding = parseInt(window.getComputedStyle(container).padding);
                windowSize = Math.min(container.clientWidth - (padding * 2), container.clientHeight - (padding * 2));
                app.renderer.resize(windowSize, windowSize);

                // Set the verticies
                originX = windowSize / 2;
                originY = windowSize - windowSize / 3;
                radius = windowSize / 3;
                vertices = setVertices();
                
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
              <Heading as="h1" className="example_title">Dial</Heading>
            </div>
          </header>
          <main style={{ display: 'flex'}}>
            <div className={styles.codeBlock}>
            <SyntaxHighlighter language="typescript" style={atomOneDark}>
                {`
                `}
              </SyntaxHighlighter>
            </div>
            <div className={styles.canvas} ref={pixiContainerRef}/>
          </main>
        </Layout>
      );
}