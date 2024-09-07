import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { serial as polyfill, SerialPort as SerialPortPolyfill } from 'web-serial-polyfill';

declare class PortOption extends HTMLOptionElement {
  port: SerialPort | SerialPortPolyfill;
}

const baudrateList = [
    9600,
    14400,
    19220,
    28800,
    38400,
    57600,
    115200,
    230400,
    460800,
    921600
];

export default function SerialConnection(): JSX.Element {
  const [state, setState] = useState({
    port: undefined,
    reader: undefined,
    baudrate: undefined,
    connected: false
  });

  const updateBaudrate = (EventTarget) => {
    const value = EventTarget.target.value;
    setState(prevState => ({
      ...prevState,
      baudrate: value
    }));
  };

  return (
    <div style={{ display: 'flex' }}>
      <div className={clsx(styles.compPadding)}>
        <select id="port">
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>
      </div>
      <div className={clsx(styles.compPadding)}>
        <button className={clsx(styles.button)}>Connect</button>
      </div>
      <div className={clsx(styles.compPadding)}>
        <select id="baudrate" onChange={updateBaudrate}>
          {baudrateList.map((baudrate, index) => (
            <option key={index} value={baudrate} selected={baudrate == 115200}>
              {baudrate}
            </option>
          ))}
        </select>
      </div>
    </div>   
  );
}