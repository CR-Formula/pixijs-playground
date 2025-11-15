import { BrakesAccelModel } from "./brakesAccelModel";
import { GPSModel } from "./gpsModel";

export default class TelemetryModel {
  // Models
  private gpsModel = new GPSModel(); // 25 Hz
  private brakesAccelModel = new BrakesAccelModel(); // 10 Hz

  // Data lists
  public gpsData: GPSPacket[] = [];
  public brakesAccelData: BrakesAccelPacket[] = [];

  constructor() {
    // Link data lists
    this.gpsData = this.gpsModel.gpsData;
    this.brakesAccelData = this.brakesAccelModel.brakesAccelData;

    // Start generating data
    this.gpsModel.startDemo();
    this.brakesAccelModel.startDemo();
  }
}