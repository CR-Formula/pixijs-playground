/**
 * Defines a LoRa Packet with Engine RPM, Throttle Positon,
 * Steering Angle, and Brake Pressure.
 * 
 * 20 Hz packet with ID 0x03.
 */
interface EngineDataPacket extends Packet {
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
}