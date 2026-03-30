import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { Server as IOServer } from 'socket.io';
import { SerialPort } from 'serialport';

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: '*' } });

const TARGET_PRODUCT_ID = '5740';
const SERIAL_BAUD_RATE = 115200;
const SERIAL_SCAN_INTERVAL_MS = 2000;

let serialPort: SerialPort | null = null;

const telemetryHistory: { timestamp: number; packet: Buffer }[] = [];
const MAX_HISTORY_RETURN = 5000;

server.listen(3001, '0.0.0.0', () => {
    console.log('listening on 0.0.0.0:3001');
});

io.on('connection', socket => 
    socket.emit('telemetry:history', telemetryHistory.slice(-MAX_HISTORY_RETURN))
);

// start scanning for serial device
findAndConnectSerial();
setInterval(() => {
    if (!serialPort) findAndConnectSerial();
}, SERIAL_SCAN_INTERVAL_MS);



function handleSerialData(buf: Buffer) {
    const data = { timestamp: Date.now(), packet: buf };
    io.emit('telemetry', data);
    telemetryHistory.push(data);
}

async function findAndConnectSerial() {
    try {
        const ports = await SerialPort.list();

        const match = ports.find(p => {
            const pid = (p.productId || '') as string;
            if (!pid) return false;
            const normalized = pid.replace(/^0x/i, '').toLowerCase();
            return normalized === TARGET_PRODUCT_ID.toLowerCase();
        }) || (ports.length == 1 ? ports[0] : undefined);

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