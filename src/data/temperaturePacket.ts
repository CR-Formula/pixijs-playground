import { Packet } from "./packet";

/**
 * Defines a LoRa Packet with Air and Coolant Temperatures.
 * 
 * 1 Hz packet with ID 0x05.
 */
export class TemperaturePacket extends Packet {
  readonly PacketID = 5;

  /** Air temperature in degrees Fahrenheit. */
  AirTemp: number;

  /** Coolant temperature in degrees Fahrenheit. */
  CoolTemp: number;

  constructor(airTemp: number, coolTemp: number, timestamp?: EpochTimeStamp) {
    super(timestamp);
    this.AirTemp = airTemp;
    this.CoolTemp = coolTemp;
  }
}