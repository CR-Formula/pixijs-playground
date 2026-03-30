import TelemetryModel, { Dataset } from '../models/telemetryModel';
import { io, Socket } from 'socket.io-client';

///// Global Dataset for Client /////
const clientModel: TelemetryModel = new TelemetryModel();
export const clientDataset = clientModel.dataset;

///// DEMO MODE /////
clientModel.startDemo();



let socket: Socket | null = null;
socket = io('http://192.168.137.1:3001');

socket.on('telemetry:history', (packets: { timestamp: number; packet: Buffer }[]) => {
  for (const packet of packets) {
    clientModel.parseData(packet.packet, packet.timestamp);
  }
});

socket.on('telemetry', (data: { timestamp: number; packet: Buffer }) => {
  clientModel.parseData(data.packet, data.timestamp);
});