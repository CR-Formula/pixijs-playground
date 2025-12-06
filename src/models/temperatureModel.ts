export class TemperatureModel {
  private dataHz: number = 1;
  public temperatureData : TemperaturePacket[] = [];

  private angle: number = 0;

  generateSample() : TemperaturePacket {
    this.angle += 0.1;

    var packet: TemperaturePacket = {
      PacketID: 2,
      Timestamp: 0,
      AirTemp: Math.cos(this.angle) + 3 * Math.sin(this.angle/5),
      CoolTemp: Math.sin(this.angle/3) + 3 * Math.sin(this.angle/4)
    };

    return packet;
  }

  startDemo() {
    const period = Math.round(1000 / this.dataHz);
    window.setInterval(() => {
      this.temperatureData.push(this.generateSample());
    }, period);
  }
}