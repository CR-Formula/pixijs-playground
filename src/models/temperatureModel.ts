import { TemperaturePacket } from "../data/temperaturePacket";

export class TemperatureModel {
  private dataHz: number = 1;
  public temperatureData : TemperaturePacket[] = [];

  private angle: number = 0;

  generateSample() : TemperaturePacket {
    this.angle += 0.1;

    var packet: TemperaturePacket = new TemperaturePacket(
      Math.cos(this.angle) + 3 * Math.sin(this.angle/5),
      Math.sin(this.angle/3) + 3 * Math.sin(this.angle/4)
    );

    return packet;
  }

  addPacket(packet: TemperaturePacket) {
    this.temperatureData.push(packet);
  }

  startDemo() {
    const period = Math.round(1000 / this.dataHz);
    globalThis.setInterval(() => {
      this.temperatureData.push(this.generateSample());
    }, period);
  }
}