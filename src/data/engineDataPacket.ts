import { Packet } from "./packet";

/**
 * Defines a LoRa Packet with Engine RPM, Throttle Positon,
 * Steering Angle, and Brake Pressure.
 * 
 * 20 Hz packet with ID 0x03.
 */
export class EngineDataPacket extends Packet {
  readonly PacketID = 3;

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
}