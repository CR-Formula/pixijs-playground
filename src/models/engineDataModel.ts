import { EngineDataPacket } from "../data/engineDataPacket";

export class EngineDataModel {
  private dataHz: number = 20;
  public engineData : EngineDataPacket[] = [];

  private angle: number = 0;

  generateSample() : EngineDataPacket {
    this.angle += 0.1;

    var packet: EngineDataPacket = new EngineDataPacket(
      0,
      0,
      Math.cos(this.angle) + 3 * Math.sin(this.angle/5),
      Math.sin(this.angle/3) + 3 * Math.sin(this.angle/4),
      0,
      0
    );

    return packet;
  }

  addPacket(packet: EngineDataPacket) {
    this.engineData.push(packet);
  }

  startDemo() {
    const period = Math.round(1000 / this.dataHz);
    globalThis.setInterval(() => {
      this.engineData.push(this.generateSample());
    }, period);
  }
}