import { Packet, PacketType } from "../data/packet.ts";
import { BrakesAccelPacket } from "../data/brakesAccelPacket.ts";
import { EngineDataPacket } from "../data/engineDataPacket.ts";
import { GPSPacket } from "../data/gpsPacket.ts";
import { SuspensionPacket } from "../data/suspensionPacket.ts";
import { TemperaturePacket } from "../data/temperaturePacket.ts";

import { BrakesAccelModel } from "./brakesAccelModel.ts";
import { EngineDataModel } from "./engineDataModel.ts";
import { GPSModel } from "./gpsModel.ts";
import { SuspensionModel } from "./suspensionModel.ts";
import { TemperatureModel } from "./temperatureModel.ts";

export default class TelemetryModel {
  // Models
  private readonly suspensionModel  = new SuspensionModel();  // 50 Hz
  private readonly gpsModel         = new GPSModel();         // 25 Hz
  private readonly engineDataModel  = new EngineDataModel();  // 20 Hz
  private readonly brakesAccelModel = new BrakesAccelModel(); // 10 Hz
  private readonly temperatureModel = new TemperatureModel(); // 1 Hz

  // Data lists
  public readonly suspensionData:  SuspensionPacket[] = [];
  public readonly gpsData:         GPSPacket[] = [];
  public readonly engineData:      EngineDataPacket[] = [];
  public readonly brakesAccelData: BrakesAccelPacket[] = [];
  public readonly temperatureData: TemperaturePacket[] = [];

  constructor() {
    // Link data lists
    this.suspensionData  = this.suspensionModel.suspensionData;
    this.gpsData         = this.gpsModel.gpsData;
    this.engineData      = this.engineDataModel.engineData;
    this.brakesAccelData = this.brakesAccelModel.brakesAccelData;
    this.temperatureData = this.temperatureModel.temperatureData;

    // Generate demo data
    // this.startDemo();
  }

  public parsePacket(buf: Buffer) : Packet {
    switch (buf[0]) {
      // Suspension Packet
      case PacketType.Suspension:
        const suspensionPacket = SuspensionPacket.fromBuffer(buf);
        this.suspensionModel.addPacket(suspensionPacket);
        return suspensionPacket;

      // GPS Packet
      case PacketType.GPS:
        const gpsPacket = GPSPacket.fromBuffer(buf);
        this.gpsModel.addPacket(gpsPacket);
        return gpsPacket;

      // Engine Data Packet
      case PacketType.EngineData:
        const engineDataPacket = EngineDataPacket.fromBuffer(buf);
        this.engineDataModel.addPacket(engineDataPacket);
        return engineDataPacket;

      // Brakes and Accel Packet
      case PacketType.BrakesAccel:
        const brakesAccelPacket = BrakesAccelPacket.fromBuffer(buf);
        this.brakesAccelModel.addPacket(brakesAccelPacket);
        return brakesAccelPacket;

      // Temperature Packet
      case PacketType.Temperature:
        const temperaturePacket = TemperaturePacket.fromBuffer(buf);
        this.temperatureModel.addPacket(temperaturePacket);
        return temperaturePacket;
    }
  }
  
  public startDemo() {
    // Start generating data
    this.suspensionModel.startDemo();
    this.gpsModel.startDemo();
    this.engineDataModel.startDemo();
    this.brakesAccelModel.startDemo();
    this.temperatureModel.startDemo();
  }
}