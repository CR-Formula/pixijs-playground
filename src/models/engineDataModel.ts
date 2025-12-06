export class EngineDataModel {
  private dataHz: number = 20;
  public engineData : EngineDataPacket[] = [];

  private angle: number = 0;

  generateSample() : EngineDataPacket {
    this.angle += 0.1;

    var packet: EngineDataPacket = {
      PacketID: 2,
      Timestamp: 0,
      BrakePressure: 0,
      ThrottleADC: 0,
      Steering: Math.cos(this.angle) + 3 * Math.sin(this.angle/5),
      RPM: Math.sin(this.angle/3) + 3 * Math.sin(this.angle/4),
      ThrottlePosSensor: 0,
      Lambda: 0
    };

    return packet;
  }

  startDemo() {
    const period = Math.round(1000 / this.dataHz);
    window.setInterval(() => {
      this.engineData.push(this.generateSample());
    }, period);
  }
}