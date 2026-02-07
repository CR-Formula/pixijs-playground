import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import bodyParser from 'body-parser';
import TelemetryModel from './models/telemetryModel.ts';

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: '*' } });

const telemetry = new TelemetryModel();
const GPS_HISTORY_LIMIT = 1000;
const GPS_EMIT_PERIOD_MS = 40; // 25 Hz

io.on('connection', socket => {
    console.log('client connected');
    const history = telemetry.gpsData.slice(-GPS_HISTORY_LIMIT);
    if (history.length > 0) {
        socket.emit('telemetry:gps:init', history);
    }
});

function handleUplink(data) {
    io.emit('telemetry', data);
}

globalThis.setInterval(() => {
    const latestGps = telemetry.gpsData[telemetry.gpsData.length - 1];
    if (latestGps) {
        io.emit('telemetry:gps', latestGps);
    }
}, GPS_EMIT_PERIOD_MS);

server.listen(3001, '0.0.0.0', () => {
    console.log('listening on 0.0.0.0:3001');
});