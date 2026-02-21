import { Packet, PacketType } from "./packet";

/**
 * Defines a LoRa Packet with GPS Latitude, Longitude, and Speed.
 * 
 * 25 Hz packet with ID 0x02.
 */
export class GPSPacket extends Packet {
  readonly Type = PacketType.GPS;

  /** GPS latitude. */
  Latitude: number;

  /** GPS longitude. */
  Longitude: number;

  /** Vehicle speed measured by GPS. */
  Speed: number;

  /**
   * Creates a new LoRa packet with GPS Latitude, Longitude, and Speed.
   * @param latitude GPS latitude.
   * @param longitude GPS longitude.
   * @param speed Vehicle speed measured by GPS.
   * @param timestamp Optional timestamp; defaults to current time if not provided.
   */
  constructor(
    latitude: number,
    longitude: number,
    speed: number,
    timestamp?: EpochTimeStamp
  ) {
    super(timestamp);
    this.Latitude = latitude;
    this.Longitude = longitude;
    this.Speed = speed;
  }

  /**
   * Creates a GPSPacket from a LoRa buffer, skipping the first byte (packet ID).
   * @param buf The buffer containing the LoRa packet data, with the first byte being the packet ID.
   * @returns A new GPSPacket instance.
  */
  static fromBuffer(buf: Buffer): GPSPacket {
    return new GPSPacket(
      (buf.readInt32LE(1)) / 100000000,
      (buf.readInt32LE(5)) / 100000000,
      buf.readUInt32LE(9)
    );
  }
}