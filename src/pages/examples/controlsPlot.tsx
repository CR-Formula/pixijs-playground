import { JSX } from 'react';
import TimePlot from './timePlot';
import { ModelDataType } from '@site/src/models/model';
import { ControlsModelData } from '@site/src/models/controlsModel';

export default function ControlsPlot(): JSX.Element {
  return (
    <TimePlot
      sources={[
        { dataType: ModelDataType.Controls, selector: (d) => (d as ControlsModelData).ThrottleRaw1, color: 0x00cc00, label: 'Throttle1' },
        { dataType: ModelDataType.Controls, selector: (d) => (d as ControlsModelData).ThrottleRaw2, color: 0x00aa00, label: 'Throttle2' },
        { dataType: ModelDataType.Controls, selector: (d) => (d as ControlsModelData).BrakePressure / 3000, color: 0xff0000, label: 'Brake' },
      ]}
      title="Controls Plot"
      subtitle="Throttle and Brake over time"
      xLabel="Time"
      yLabel="Value"
    />
  );
}
