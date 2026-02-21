import { Packet, PacketType } from "./packet";

/**
 * Defines a LoRa Packet with Front and Rear Suspension data.
 * 
 * 50 Hz packet with ID 0x01.
 */
export class SuspensionPacket extends Packet {
  readonly Type = PacketType.Suspension;

  /** Potentiometer value for the front right damper. */
  FrontPot: number;

  /** Potentiometer value for the rear right damper. */
  RearPot: number;

  /**
   * Creates a new LoRa packet with Front and Rear Suspension data.
   * @param frontPot Potentiometer value for the front right damper.
   * @param rearPot Potentiometer value for the rear right damper.
   * @param timestamp Optional timestamp; defaults to current time if not provided.
   */
  constructor(
    frontPot: number,
    rearPot: number,
    timestamp?: EpochTimeStamp
  ) {
    super(timestamp);
    this.FrontPot = frontPot;
    this.RearPot = rearPot;
  }

  /**
   * Creates a SuspensionPacket from a LoRa buffer, skipping the first byte (packet ID).
   * @param buf The buffer containing the LoRa packet data, with the first byte being the packet ID.
   * @returns A new SuspensionPacket instance.
  */
  static fromBuffer(buf: Buffer): SuspensionPacket {
    return new SuspensionPacket(
      buf.readUInt16LE(1), // Front Pot
      buf.readUInt16LE(3)  // Rear Pot
    );
  }
}