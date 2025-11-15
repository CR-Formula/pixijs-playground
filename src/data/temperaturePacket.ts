/**
 * Defines a LoRa Packet with Air and Coolant Temperatures.
 * 
 * 1 Hz packet with ID 0x05.
 */
interface TemperaturePacket extends Packet {
  /** Air temperature in degrees Fahrenheit. */
  AirTemp: number;

  /** Coolant temperature in degrees Fahrenheit. */
  CoolTemp: number;
}