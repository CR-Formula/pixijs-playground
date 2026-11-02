import { JSX } from 'react';
import TimePlot from './timePlot';
import DotPlot from './dotPlot';
import { ModelDataType } from '@site/src/models/model';
import { ControlsModelData } from '@site/src/models/controlsModel';
import { GPSModelData } from '@site/src/models/gpsModel';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import clsx from 'clsx';
import styles from '../css/examples.module.css';

export default function DrivingPlot(): JSX.Element {
  const controlsSources = [
    { dataType: ModelDataType.Controls, selector: (d: ControlsModelData) => d.ThrottleRaw1, color: 0x00aa00, label: 'Throttle 1' },
    { dataType: ModelDataType.Controls, selector: (d: ControlsModelData) => d.ThrottleRaw2, color: 0x33cc33, label: 'Throttle 2' },
    { dataType: ModelDataType.Controls, selector: (d: ControlsModelData) => d.BrakePressure / 3000, color: 0xaa0000, label: 'Brake Pressure' },
  ];

  // GPS will be displayed as a Lat/Lon DotPlot instead of a time series

  return (
    <Layout>
      <header className={clsx(styles.headerBanner)}>
        <div className="container">
          <Heading as="h1" className="example_title">Driving Overview</Heading>
          <p style={{ marginTop: 8 }}>Controls and GPS telemetry during driving</p>
        </div>
      </header>
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
        <div style={{ display: 'flex', gap: 20, width: '100%', padding: 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <TimePlot inline sources={controlsSources} xLabel="Time" yLabel="Value" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <DotPlot
              inline
              dataType={ModelDataType.GPS}
              xSelector={(d: GPSModelData) => d.Longitude}
              ySelector={(d: GPSModelData) => d.Latitude}
              xLabel="Longitude"
              yLabel="Latitude"
              title="Position"
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}
