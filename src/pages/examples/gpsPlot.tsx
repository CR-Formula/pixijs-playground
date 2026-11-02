import { JSX } from 'react';
import DotPlot from './dotPlot';
import { ModelDataType } from '@site/src/models/model';
import { GPSModelData } from '@site/src/models/gpsModel';

export default function GPSPlot(): JSX.Element {
  return (
    <DotPlot
      dataType={ModelDataType.GPS}
      xSelector={(d) => (d as GPSModelData).Latitude}
      ySelector={(d) => (d as GPSModelData).Longitude}
      xLabel="Latitude"
      yLabel="Longitude"
      title="GPS Plot"
      subtitle="GPS Location"
    />
  );
}
