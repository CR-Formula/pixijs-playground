import { Packet } from "./packet";

/**
 * Defines a LoRa Packet with GPS Latitude, Longitude, and Speed.
 * 
 * 25 Hz packet with ID 0x02.
 */
export interface GPSPacket extends Packet {
  /** GPS latitude. */
  Latitude: number;

  /** GPS longitude. */
  Longitude: number;

  /** Vehicle speed measured by GPS. */
  Speed: number;
}