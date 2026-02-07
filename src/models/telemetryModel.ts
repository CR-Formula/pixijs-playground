import { BrakesAccelModel } from "./brakesAccelModel.ts";
import { EngineDataModel } from "./engineDataModel.ts";
import { GPSModel } from "./gpsModel.ts";
import { SuspensionModel } from "./suspensionModel.ts";
import { TemperatureModel } from "./temperatureModel.ts";
import { BrakesAccelPacket } from "../data/brakesAccelPacket.ts";
import { EngineDataPacket } from "../data/engineDataPacket.ts";
import { GPSPacket } from "../data/gpsPacket.ts";
import { SuspensionPacket } from "../data/suspensionPacket.ts";
import { TemperaturePacket } from "../data/temperaturePacket.ts";

export default class TelemetryModel {
  // Models
  public suspensionModel  = new SuspensionModel();  // 50 Hz
  public gpsModel         = new GPSModel();         // 25 Hz
  public engineDataModel  = new EngineDataModel();  // 20 Hz
  public brakesAccelModel = new BrakesAccelModel(); // 10 Hz
  public temperatureModel = new TemperatureModel(); // 1 Hz

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