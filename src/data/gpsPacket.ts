import { Packet } from "./packet";

/**
 * Defines a LoRa Packet with GPS Latitude, Longitude, and Speed.
 * 
 * 25 Hz packet with ID 0x02.
 */
export class GPSPacket extends Packet {
  readonly PacketID = 2;

  /** GPS latitude. */
  Latitude: number;

  /** GPS longitude. */
  Longitude: number;

  /** Vehicle speed measured by GPS. */
  Speed: number;

  constructor(latitude: number, longitude: number, speed: number, timestamp?: EpochTimeStamp) {
    super(timestamp);
    this.Latitude = latitude;
    this.Longitude = longitude;
    this.Speed = speed;
  }
}