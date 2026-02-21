/**
 * Defines a generic LoRa packet recorded from the car.
 */
export abstract class Packet {
  /** Packet type identifier, provided by subclasses. */
  abstract readonly PacketID: number;

  /** The time that the recorded LoRa packet was received. */
  Timestamp: EpochTimeStamp;

  constructor(timestamp?: EpochTimeStamp) {
    this.Timestamp = timestamp ?? Date.now();
  }
}