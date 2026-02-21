import { Packet, PacketType } from "./packet";

/**
 * Defines a LoRa Packet with Engine RPM, Throttle Positon,
 * Steering Angle, and Brake Pressure.
 * 
 * 20 Hz packet with ID 0x03.
 */
export class EngineDataPacket extends Packet {
  readonly Type = PacketType.EngineData;

  /** Recorded pressure of the brakes. */
  BrakePressure: number;

  /** Analog throttle position. */
  ThrottleADC: number;

  /** Steering angle. */
  Steering: number;

  /** RPM of the engine. */
  RPM: number; // Likely obsolete soon

  /** Throttle position from ECU. */
  ThrottlePosSensor: number;

  Lambda: number; // Unsure what this is for

  /**
   * Creates a new LoRa packet with Engine RPM, Throttle Positon, Steering Angle, and Brake Pressure.
   * @param brakePressure Recorded pressure of the brakes.
   * @param throttleADC Analog throttle position.
   * @param steering Steering angle.
   * @param rpm RPM of the engine.
   * @param throttlePosSensor Throttle position from ECU.
   * @param lambda (Unknown)
   * @param timestamp Optional timestamp; defaults to current time if not provided.
   */
  constructor(
    brakePressure: number,
    throttleADC: number,
    steering: number,
    rpm: number,
    throttlePosSensor: number,
    lambda: number,
    timestamp?: EpochTimeStamp
  ) {
    super(timestamp);
    this.BrakePressure = brakePressure;
    this.ThrottleADC = throttleADC;
    this.Steering = steering;
    this.RPM = rpm;
    this.ThrottlePosSensor = throttlePosSensor;
    this.Lambda = lambda;
  }

  /**
   * Creates an EngineDataPacket from a LoRa buffer, skipping the first byte (packet ID).
   * @param buf The buffer containing the LoRa packet data, with the first byte being the packet ID.
   * @returns A new EngineDataPacket instance.
   */
  static fromBuffer(buf: Buffer): EngineDataPacket {
    return new EngineDataPacket(
      buf.readUInt16LE(1), // Brake Pressure
      buf.readUInt16LE(3), // Throttle ADC
      buf.readUInt16LE(5), // Steering
      buf.readUInt16LE(7), // RPM
      buf.readUInt16LE(9), // Throttle Position Sensor
      buf.readUInt16LE(11) // Lambda
    );
  }
}