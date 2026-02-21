import { Packet } from "./packet";

/**
 * Defines a LoRa Packet with Oil Pressure, Brake Temperatures,
 * and Accelerometer data.
 * 
 * 10 Hz packet with ID 0x04.
 */
export class BrakesAccelPacket extends Packet {
  readonly PacketID = 4;

  /** Pressure of the oil. */
  OilPressure: number;

  /** Front right brake temperature in degrees Fahrenheit. */
  FrontBrakeTemp: number;

  /** Rear right brake temperature in degrees Fahrenheit. */
  RearBrakeTemp: number;

  /** Accelerometer X axis. */
  AccelX: number;

  /** Accelerometer Y axis. */
  AccelY: number;

  /** Accelerometer Z axis. */
  AccelZ: number;

  constructor(
    oilPressure: number,
    frontBrakeTemp: number,
    rearBrakeTemp: number,
    accelX: number,
    accelY: number,
    accelZ: number,
    timestamp?: EpochTimeStamp
  ) {
    super(timestamp);
    this.OilPressure = oilPressure;
    this.FrontBrakeTemp = frontBrakeTemp;
    this.RearBrakeTemp = rearBrakeTemp;
    this.AccelX = accelX;
    this.AccelY = accelY;
    this.AccelZ = accelZ;
  }
}