import { Packet } from "./packet";

/**
 * Defines a LoRa Packet with Front and Rear Suspension data.
 * 
 * 50 Hz packet with ID 0x01.
 */
export class SuspensionPacket extends Packet {
  readonly PacketID = 1;

  /** Potentiometer value for the front right damper. */
  FrontPot: number;

  /** Potentiometer value for the rear right damper. */
  RearPot: number;

  constructor(frontPot: number, rearPot: number, timestamp?: EpochTimeStamp) {
    super(timestamp);
    this.FrontPot = frontPot;
    this.RearPot = rearPot;
  }
}