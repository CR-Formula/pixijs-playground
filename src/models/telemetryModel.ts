import { BrakesAccelModel } from "./brakesAccelModel";
import { EngineDataModel } from "./engineDataModel";
import { GPSModel } from "./gpsModel";
import { SuspensionModel } from "./suspensionModel";
import { TemperatureModel } from "./temperatureModel";

export default class TelemetryModel {
  // Models
  private suspensionModel  = new SuspensionModel();  // 50 Hz
  private gpsModel         = new GPSModel();         // 25 Hz
  private engineDataModel  = new EngineDataModel();  // 20 Hz
  private brakesAccelModel = new BrakesAccelModel(); // 10 Hz
  private temperatureModel = new TemperatureModel(); // 1 Hz

  // Data lists
  public suspensionData:  SuspensionPacket[] = [];
  public gpsData:         GPSPacket[] = [];
  public engineData:      EngineDataPacket[] = [];
  public brakesAccelData: BrakesAccelPacket[] = [];
  public temperatureData: TemperaturePacket[] = [];

  constructor() {
    // Link data lists
    this.suspensionData  = this.suspensionModel.suspensionData;
    this.gpsData         = this.gpsModel.gpsData;
    this.engineData      = this.engineDataModel.engineData;
    this.brakesAccelData = this.brakesAccelModel.brakesAccelData;
    this.temperatureData = this.temperatureModel.temperatureData;

    // Start generating data
    this.suspensionModel.startDemo();
    this.gpsModel.startDemo();
    this.engineDataModel.startDemo();
    this.brakesAccelModel.startDemo();
    this.temperatureModel.startDemo();
  }
}