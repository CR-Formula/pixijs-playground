import { GPSPacket } from "../data/gpsPacket";

export class GPSModel {
  private dataHz: number = 25;
  public gpsData : GPSPacket[] = [];

  private angle: number = 0;

  generateSample() : GPSPacket {
    this.angle += 0.1;

    var packet: GPSPacket = {
      PacketID: 2,
      Timestamp: 0,
      Latitude: Math.cos(this.angle) + 3 * Math.sin(this.angle/5),
      Longitude: Math.sin(this.angle/3) + 3 * Math.sin(this.angle/4),
      Speed: 0
    };

    return packet;
  }

  startDemo() {
    const period = Math.round(1000 / this.dataHz);
    globalThis.setInterval(() => {
      this.gpsData.push(this.generateSample());
    }, period);
  }
}