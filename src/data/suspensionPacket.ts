import { Packet } from "./packet";

/**
 * Defines a LoRa Packet with Front and Rear Suspension data.
 * 
 * 50 Hz packet with ID 0x01.
 */
export interface SuspensionPacket extends Packet {
  /** Potentiometer value for the front right damper. */
  FrontPot: number;

  /** Potentiometer value for the rear right damper. */
  RearPot: number;
}