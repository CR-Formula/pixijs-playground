import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import bodyParser from 'body-parser';
import TelemetryModel from './models/telemetryModel.ts';
import { SerialPort } from 'serialport';
import { SuspensionPacket } from './data/suspensionPacket.ts';
import { GPSPacket } from './data/gpsPacket.ts';
import { EngineDataPacket } from './data/engineDataPacket.ts';
import { BrakesAccelPacket } from './data/brakesAccelPacket.ts';
import { TemperaturePacket } from './data/temperaturePacket.ts';

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: '*' } });

const telemetry = new TelemetryModel();
const GPS_HISTORY_LIMIT = 1000;
const GPS_EMIT_PERIOD_MS = 40; // 25 Hz

// -- Serial config (set TARGET_PRODUCT_ID to your device PID later) --
const TARGET_PRODUCT_ID = '5740'; // e.g. '6001' (no 0x)
const SERIAL_BAUD_RATE = 115200;
const SERIAL_SCAN_INTERVAL_MS = 2000;

let serialPort: SerialPort | null = null;

function handleSerialData(chunk: Buffer | string) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));

    const suspension: SuspensionPacket = new SuspensionPacket(
        buf.readUInt16LE(0),
        buf.readUInt16LE(2),
    );

    const gps: GPSPacket = new GPSPacket(
        (buf.readInt32LE(4)) / 100000000,
        (buf.readInt32LE(8)) / 100000000,
        buf.readUInt32LE(12),
    );

    const engineData: EngineDataPacket = new EngineDataPacket(
        buf.readUInt16LE(16),
        buf.readUInt16LE(18),
        buf.readUInt16LE(20),
        buf.readUInt16LE(22),
        buf.readUInt16LE(24),
        buf.readUInt16LE(26),
    );
    
    const brakesAccel: BrakesAccelPacket = new BrakesAccelPacket(
        buf.readUInt16LE(28),
        buf.readUInt16LE(30),
        buf.readUInt16LE(32),
        buf.readUInt16LE(34),
        buf.readUInt16LE(36),
        buf.readUInt16LE(38),
    );

    const temperature: TemperaturePacket = new TemperaturePacket(
        buf.readUInt16LE(40),
        buf.readUInt16LE(42),
    );

    io.emit('telemetry:gps', gps);
    // console.log('suspension', gps.Latitude, gps.Longitude);

    // const hex = buf.toString('hex');
    // // emit raw hex frames to clients; parsing can be done on the client or later server-side
    // io.emit('telemetry:raw', { hex });
}

async function findAndConnectSerial() {
    try {
        const ports = await SerialPort.list();

        const match = ports.find(p => {
            const pid = (p.productId || '') as string;
            if (!pid) return false;
            const normalized = pid.replace(/^0x/i, '').toLowerCase();
            return normalized === TARGET_PRODUCT_ID.toLowerCase();
        }) || (ports.length === 1 ? ports[0] : undefined);

        if (match && !serialPort) {
            console.log('serial: connecting to', match.path || match.pnpId || match.productId || match.vendorId || match.manufacturer || match.serialNumber || match);
            serialPort = new SerialPort({ path: match.path as string, baudRate: SERIAL_BAUD_RATE, autoOpen: false });
            serialPort.open(err => {
                if (err) {
                    console.error('serial: open error', err);
                    serialPort = null;
                    return;
                }
                console.log('serial: connected');
                // listen for raw binary data
                serialPort!.on('data', handleSerialData);
                serialPort!.on('close', () => {
                    console.log('serial: closed');
                    serialPort = null;
                });
                serialPort!.on('error', (e: any) => console.error('serial: error', e));
            });
        }
    } catch (e) {
        console.error('serial: scan error', e);
    }
}
// end findAndConnectSerial

// start scanning for serial device
findAndConnectSerial();
setInterval(() => {
    if (!serialPort) findAndConnectSerial();
}, SERIAL_SCAN_INTERVAL_MS);

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
        // io.emit('telemetry:gps', latestGps);
    }
}, GPS_EMIT_PERIOD_MS);

server.listen(3001, '0.0.0.0', () => {
    console.log('listening on 0.0.0.0:3001');
});