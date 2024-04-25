import { Application, Graphics } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../css/examples.module.css';


export default function webSerialExample() {
  
  


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
// CODE BLOCK
            `}
          </SyntaxHighlighter>
        </div>
        <div className={styles.codeBlock}>
        {/* <div style={{padding: '4px'}}><button onClick={serial.connect}>CONNECT</button></div>
        <div style={{padding: '4px'}}><button onClick={serial.disconnect}>DISCONNECT</button></div> */}
          <SyntaxHighlighter language="typescript" style={atomOneDark}>
            {/* {latestValues} */}
          </SyntaxHighlighter>
        </div>
      </main>
    </Layout>
  );
};