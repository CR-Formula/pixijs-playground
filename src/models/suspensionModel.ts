import { SuspensionPacket } from "../data/suspensionPacket";

export class SuspensionModel {
  private dataHz: number = 50;
  public suspensionData : SuspensionPacket[] = [];

  private angle: number = 0;

  generateSample() : SuspensionPacket {
    this.angle += 0.1;

    var packet: SuspensionPacket = {
      PacketID: 2,
      Timestamp: 0,
      FrontPot: Math.cos(this.angle) + 3 * Math.sin(this.angle/5),
      RearPot: Math.sin(this.angle/3) + 3 * Math.sin(this.angle/4)
    };

    return packet;
  }

  startDemo() {
    const period = Math.round(1000 / this.dataHz);
    globalThis.setInterval(() => {
      this.suspensionData.push(this.generateSample());
    }, period);
  }
}