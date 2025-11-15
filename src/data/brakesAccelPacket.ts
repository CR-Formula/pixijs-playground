/**
 * Defines a LoRa Packet with Oil Pressure, Brake Temperatures,
 * and Accelerometer data.
 * 
 * 10 Hz packet with ID 0x04.
 */
interface BrakesAccelPacket extends Packet {
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
}