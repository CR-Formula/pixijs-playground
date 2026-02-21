import { Packet, PacketType } from "./packet";

/**
 * Defines a LoRa Packet with Air and Coolant Temperatures.
 * 
 * 1 Hz packet with ID 0x05.
 */
export class TemperaturePacket extends Packet {
  readonly Type = PacketType.Temperature;

  /** Air temperature in degrees Fahrenheit. */
  AirTemp: number;

  /** Coolant temperature in degrees Fahrenheit. */
  CoolTemp: number;

  /**
   * Creates a new LoRa packet with Air and Coolant Temperatures.
   * @param airTemp Air temperature in degrees Fahrenheit.
   * @param coolTemp Coolant temperature in degrees Fahrenheit.
   * @param timestamp Optional timestamp; defaults to current time if not provided.
   */
  constructor(
    airTemp: number,
    coolTemp: number,
    timestamp?: EpochTimeStamp
  ) {
    super(timestamp);
    this.AirTemp = airTemp;
    this.CoolTemp = coolTemp;
  }

  /**
   * Creates a TemperaturePacket from a LoRa buffer, skipping the first byte (packet ID).
   * @param buf The buffer containing the LoRa packet data, with the first byte being the packet ID.
   * @return A new TemperaturePacket instance.
   */
  static fromBuffer(buf: Buffer): TemperaturePacket {
    return new TemperaturePacket(
      buf.readInt16LE(1), // Air Temp
      buf.readInt16LE(3)  // Coolant Temp
    );
  }
}