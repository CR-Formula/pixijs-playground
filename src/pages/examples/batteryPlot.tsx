import { JSX } from 'react';
import TimePlot from './timePlot';
import { ModelDataType } from '@site/src/models/model';
import { BatteryModelData } from '@site/src/models/batteryModel';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import clsx from 'clsx';
import styles from '../css/examples.module.css';

export default function BatteryPlot(): JSX.Element {
  // Selectors for min, max, and average across cell arrays
  const minSelector = (arrKey: 'CellVolts' | 'CellTemps') => (d: BatteryModelData) => {
    const arr = (d as any)[arrKey] as number[] | undefined;
    if (!arr || arr.length === 0) return NaN;
    return arr.reduce((a, b) => Math.min(a, b), Infinity);
  };

  const maxSelector = (arrKey: 'CellVolts' | 'CellTemps') => (d: BatteryModelData) => {
    const arr = (d as any)[arrKey] as number[] | undefined;
    if (!arr || arr.length === 0) return NaN;
    return arr.reduce((a, b) => Math.max(a, b), -Infinity);
  };

  const avgSelector = (arrKey: 'CellVolts' | 'CellTemps') => (d: BatteryModelData) => {
    const arr = (d as any)[arrKey] as number[] | undefined;
    if (!arr || arr.length === 0) return NaN;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  };

  const gray = 0x888888;
  const black = 0x000000;

  const voltageSources = [
    { dataType: ModelDataType.Battery, selector: minSelector('CellVolts'), color: gray, label: 'Min Voltage' },
    { dataType: ModelDataType.Battery, selector: maxSelector('CellVolts'), color: gray, label: 'Max Voltage' },
    { dataType: ModelDataType.Battery, selector: avgSelector('CellVolts'), color: black, label: 'Avg Voltage' },
  ];

  const tempSources = [
    { dataType: ModelDataType.Battery, selector: minSelector('CellTemps'), color: gray, label: 'Min Temp' },
    { dataType: ModelDataType.Battery, selector: maxSelector('CellTemps'), color: gray, label: 'Max Temp' },
    { dataType: ModelDataType.Battery, selector: avgSelector('CellTemps'), color: black, label: 'Avg Temp' },
  ];

  return (
    <Layout>
      <header className={clsx(styles.headerBanner)}>
        <div className="container">
          <Heading as="h1" className="example_title">Battery Overview</Heading>
          <p style={{ marginTop: 8 }}>Min / Max / Average cell voltages and temperatures</p>
        </div>
      </header>
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
        <div style={{ display: 'flex', gap: 20, width: '100%', padding: 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <TimePlot
              inline
              sources={voltageSources}
              xLabel="Time"
              yLabel="Voltage (V)"
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <TimePlot
              inline
              sources={tempSources}
              xLabel="Time"
              yLabel="Temperature (C)"
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}
