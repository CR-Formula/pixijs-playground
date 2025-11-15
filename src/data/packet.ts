/**
 * Defines a generic LoRa packet recorded from the car.
 */
interface Packet {
  /** The ID of the recorded LoRa packet. */
  PacketID: number;
  
  /** The time that the recorded LoRa packet was received. */
  Timestamp: EpochTimeStamp;
}