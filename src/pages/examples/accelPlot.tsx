import { JSX } from 'react';
import DotPlot from './dotPlot';
import { ModelDataType } from '@site/src/models/model';
import { IMUModelData } from '@site/src/models/imuModel';

export default function AccelPlot(): JSX.Element {
  return (
    <DotPlot
      dataType={ModelDataType.IMU}
      xSelector={(d) => (d as IMUModelData).GyroX}
      ySelector={(d) => (d as IMUModelData).GyroY}
      xLabel="Accel X"
      yLabel="Accel Y"
      title="Accel Plot"
      subtitle="IMU Acceleration X vs Y"
    />
  );
}
