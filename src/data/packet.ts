/**
 * Defines a generic LoRa packet recorded from the car.
 */
export abstract class Packet {
  /** Packet type identifier, provided by subclasses. */
  abstract readonly Type: PacketType;

  /** The time that the recorded LoRa packet was received. */
  Timestamp: EpochTimeStamp;

  constructor(timestamp?: EpochTimeStamp) {
    this.Timestamp = timestamp ?? Date.now();
  }
}

/**
 * Enum for packet types, corresponding to the first byte of each LoRa packet.
 */
export enum PacketType {
  Suspension = 0x01,
  GPS = 0x02,
  EngineData = 0x03,
  BrakesAccel = 0x04,
  Temperature = 0x05,
}