import { BrakesAccelPacket } from "../data/brakesAccelPacket";

export class BrakesAccelModel {
  private dataHz: number = 10;
  public brakesAccelData : BrakesAccelPacket[] = [];

  private angle: number = 0;

  generateSample() : BrakesAccelPacket {
    this.angle += 0.1;

    var packet: BrakesAccelPacket = new BrakesAccelPacket(
      0,
      0,
      0,
      Math.cos(this.angle),
      Math.sin(this.angle),
      0
    );

    return packet;
  }

  startDemo() {
    const period = Math.round(1000 / this.dataHz);
    globalThis.setInterval(() => {
      this.brakesAccelData.push(this.generateSample());
    }, period);
  }
}