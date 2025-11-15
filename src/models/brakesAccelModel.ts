export class BrakesAccelModel {
  private dataHz: number = 10;
  public brakesAccelData : BrakesAccelPacket[] = [];

  private angle: number = 0;

  generateSample() : BrakesAccelPacket {
    this.angle += 0.1;

    var packet: BrakesAccelPacket = {
      PacketID: 2,
      Timestamp: 0,
      OilPressure: 0,
      FrontBrakeTemp: 0,
      RearBrakeTemp: 0,
      AccelX: Math.cos(this.angle),
      AccelY: Math.sin(this.angle),
      AccelZ: 0
    };

    return packet;
  }

  startDemo() {
    const period = Math.round(1000 / this.dataHz);
    window.setInterval(() => {
      this.brakesAccelData.push(this.generateSample());
    }, period);
  }
}