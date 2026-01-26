import { Application, Graphics } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../css/examples.module.css';

export default function serialExample() {
  var messages;

  // @TODO Remove filter - unnecessary, ease of testing is only purpose
  const handleConnect = async () => {
    const usbVendorId = 0x10C4
    ;
    navigator.serial
      .requestPort({ filters: [{ usbVendorId }] })
      .then((port) => {
        readSerialOuput(port);
      })
      .catch((e) => {
        // No selected port
      });
  };

  const readSerialOuput = async (port) => {
    while (port.readable) {
      const reader = port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            messages
            break;
          }
          // Cut and prettiefy output
          messages = value;
        }
      } catch (error) {
      } finally {
        reader.releaseLock();
      }
    }
  }

  // Create clean handled disconnect with saving of last complete dataset, then cut the rest off
  const handleDisconnect = () => {
    
  };

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

            `}
          </SyntaxHighlighter>
        </div>
        <div className={styles.codeBlock}>
        <div style={{padding: '10px'}}><button onClick={handleConnect}>CONNECT</button></div>
        <div style={{padding: '10px'}}><button onClick={handleDisconnect}>DISCONNECT</button></div>
          <SyntaxHighlighter language="typescript" style={atomOneDark}>
            {messages}
          </SyntaxHighlighter>
        </div>
      </main>
    </Layout>
  );
};