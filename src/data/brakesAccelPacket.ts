import { Packet, PacketType } from "./packet";

/**
 * Defines a LoRa Packet with Oil Pressure, Brake Temperatures,
 * and Accelerometer data.
 * 
 * 10 Hz packet with ID 0x04.
 */
export class BrakesAccelPacket extends Packet {
  readonly Type = PacketType.BrakesAccel;

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

  /**
   * Creates a new LoRa packet with Oil Pressure, Brake Temperatures, and Accelerometer data.
   * @param oilPressure Pressure of the oil.
   * @param frontBrakeTemp Front right brake temperature in degrees Farenheit.
   * @param rearBrakeTemp Rear right brake temperature in degrees Fahrenheit.
   * @param accelX Accelerometer X axis.
   * @param accelY Accelerometer Y axis.
   * @param accelZ Accelerometer Z axis.
   * @param timestamp Optional timestamp; defaults to current time if not provided.
   */
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

  /**
   * Creates a BrakesAccelPacket from a LoRa buffer, skipping the first byte (packet ID).
   * @param buf The buffer containing the LoRa packet data, with the first byte being the packet ID.
   * @returns A new BrakesAccelPacket instance.
   */
  static fromBuffer(buf: Buffer): BrakesAccelPacket {
    return new BrakesAccelPacket(
      buf.readUInt16LE(1), // Oil Pressure
      buf.readUInt16LE(3), // Front Brake Temp
      buf.readUInt16LE(5), // Rear Brake Temp
      buf.readUInt16LE(7), // Accel X
      buf.readUInt16LE(9), // Accel Y
      buf.readUInt16LE(11) // Accel Z
    );
  }
}