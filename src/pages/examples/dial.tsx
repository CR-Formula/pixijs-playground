import { Application, Graphics, Text } from 'pixi.js';
import { useEffect, useRef } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../css/examples.module.css';

// add the ticker at very end of main file fucntion (check random number e.g.) |||
// create var value : number; |||
// value - min = x
// max - min = y
// x / y to get fraction of vectors to draw
// multuply that fracion by len(vectors) to draw |||
// ALSO make new branch to separate dial from my square branch

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
            var value : number;
            var minVal : number;
            var maxVal : number;
            var incrementHolder : number;
            var unitHolder : string;

            minVal = 0;
            maxVal = 100;
            value = 75;
            unitHolder = 'Mp/h'

            // 

            // Create a new application
            const app = new Application();

            // Initialize the application
            await app.init({ background:'#d3d3d3', antialias: true });

            // Find New Vertices
            const setVertices = () => {
                var newVertices : number[] = [];
                var increment = Math.PI / 250;

                for (var angle = 0; angle < Math.PI; angle += increment) {
                    var x = originX + -1 * Math.cos(angle) * radius;
                    var y = originY + -1 * Math.sin(angle) * radius;
                    newVertices = [...newVertices, x, y];
                }

                return newVertices;
            };

            const draw = () => {
                app.stage.removeChildren();
                const graphics = new Graphics();

                graphics.moveTo(vertices[0], vertices[1]);
                for (var i = 0; i < vertices.length; i += 2) {
                    var x = vertices[i];
                    var y = vertices[i+1];
                    graphics.lineTo(x,y);

                    incrementHolder = i
                }

                for (var i = incrementHolder; i >= 0; i -= 2) {
                  var x = ((vertices[i] - originX) * (3/5)) + originX;
                  var y = ((vertices[i+1] - originY) * (3/5)) + originY;
                  graphics.lineTo(x,y);
                }
              
                graphics.lineTo(vertices[0], vertices[1]);
                graphics.closePath();

                graphics.fill(0x000000);
                graphics.stroke({ width: 3, color: 0x000000})

                graphics.moveTo(vertices[0], vertices[1]);
                for (var i = 0; i < (vertices.length * ((value - minVal) / (maxVal - minVal))); i += 2) {
                    var x = vertices[i];
                    var y = vertices[i+1];
                    graphics.lineTo(x,y);

                    incrementHolder = i
                }
                
                for (var i = incrementHolder; i >= 0; i -= 2) {
                  var x = ((vertices[i] - originX) * (3/5)) + originX;
                  var y = ((vertices[i+1] - originY) * (3/5)) + originY;
                  graphics.lineTo(x,y);
                }
              
                graphics.lineTo(vertices[0], vertices[1]);
                graphics.closePath();

                graphics.fill(0x7285A5);
                graphics.stroke({ width: 0, color: 0x000000 });

                graphics.moveTo(originX, originY)
                graphics.stroke({ width: 2, color: 0x000000})

                app.stage.addChild(graphics);

                let valueLabel = new Text({
                  text: (value),
                  x: originX - windowSize / 12,
                  y: originY - windowSize / 9,
                  style:{
                    fontFamily:'short-stack',
                    fontSize : 8,
                    fill: "#000000"
                  }
                });

                let unitLabel = new Text({
                  text: (unitHolder),
                  x: originX - windowSize / 9,
                  y: originY,
                  style:{
                    fontFamily:'short-stack',
                    fontSize : 8,
                    fill: "#000000"
                  }
                });
            
            app.stage.addChild(valueLabel);
            app.stage.addChild(unitLabel);
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

            // Utilized to call the draw - 60fps
          app.ticker.add(() => {
            draw();

          });

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