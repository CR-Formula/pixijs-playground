import { Application, Graphics } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../css/examples.module.css';
import useSerialConnection from '@site/src/scripts/serialInput';

export default function serialExample() {
  const connection = useSerialConnection();

  const init = (() => {
    connection.init(connection.state.id);
  });

  const connect = (async () => {
    await connection.connect();
  });

  const latestValues = "NULL";
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
        <div style={{padding: '10px'}}><button onClick={connection.selectPort}>SELECT PORT</button></div>
        <div style={{padding: '10px'}}><button onClick={init}>INIT</button></div>
        <div style={{padding: '10px'}}><button onClick={connect}>CONNECT</button></div>
          <SyntaxHighlighter language="typescript" style={atomOneDark}>
            {latestValues}
          </SyntaxHighlighter>
        </div>
      </main>
    </Layout>
  );
};