import { Application, Graphics } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../css/examples.module.css';
import SerialProvider, { useSerial, SerialMessage } from '@site/src/scripts/serialProvider';

export default function serialExample() {
  const {
    canUseSerial,
    connect,
    disconnect,
    portState,
    subscribe,
  } = useSerial(); // Destructure the values and functions from the context

  const [messages, setMessages] = useState<SerialMessage[]>([]);

  useEffect(() => {
    if (!canUseSerial) {
      console.error('Web Serial API is not supported by this browser.');
      return;
    }

    // Subscribe to incoming serial messages
    const unsubscribe = subscribe((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      unsubscribe();
    };
  }, [canUseSerial, subscribe]);

  const handleConnect = async () => {
    const connected = await connect();
    if (!connected) {
      console.error('Failed to connect to the serial port.');
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <Layout>
    <SerialProvider>
      <header className={clsx(styles.headerBanner)}>
        <div className="container">
          <Heading as="h1" className="example_title">Hello Triangle</Heading>
        </div>
      </header>
      <main style={{ display: 'flex'}}>
        <div className={styles.codeBlock}>
          <SyntaxHighlighter language="typescript" style={atomOneDark}>
            {`
const {
    canUseSerial,
    connect,
    disconnect,
    portState,
    subscribe,
  } = useSerial(); // Destructure the values and functions from the context

  const [messages, setMessages] = useState<SerialMessage[]>([]);

  useEffect(() => {
    if (!canUseSerial) {
      console.error('Web Serial API is not supported by this browser.');
      return;
    }

    // Subscribe to incoming serial messages
    const unsubscribe = subscribe((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      unsubscribe();
    };
  }, [canUseSerial, subscribe]);

  const handleConnect = async () => {
    const connected = await connect();
    if (!connected) {
      console.error('Failed to connect to the serial port.');
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };
            `}
          </SyntaxHighlighter>
        </div>
        <div className={styles.codeBlock}>
        {/* <div style={{padding: '10px'}}><button onClick={connection.selectPort}>SELECT PORT</button></div> */}
        <div style={{padding: '10px'}}><button onClick={handleConnect}>CONNECT</button></div>
        <div style={{padding: '10px'}}><button onClick={handleDisconnect}>DISCONNECT</button></div>
          <SyntaxHighlighter language="typescript" style={atomOneDark}>
            {messages}
          </SyntaxHighlighter>
        </div>
      </main>
    </SerialProvider>
    </Layout>
  );
};