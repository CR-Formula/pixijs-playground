import { Model, ModelData, ModelDataType, PacketType } from "./model";

/**
 * Models the data from the BNO055 IMU (Inertial Measurement Unit).
 * 
 * @author AWBirky
 */
export class IMUModel extends Model<IMUModelData> {
    protected readonly packetHandlers = {
        // IMU Packet
        [PacketType.IMU]: (buf: Buffer) => {
            if (buf.length < 0x14) return null;

            return new IMUModelData(
                buf.readInt16LE(0x00) / 900.0, // rad/s
                buf.readInt16LE(0x02) / 900.0, // rad/s
                buf.readInt16LE(0x04) / 900.0, // rad/s
                buf.readInt16LE(0x06) / 16384.0, // unitless
                buf.readInt16LE(0x08) / 16384.0, // unitless
                buf.readInt16LE(0x0A) / 16384.0, // unitless
                buf.readInt16LE(0x0C) / 16384.0, // unitless
                buf.readInt16LE(0x0E) / 100.0, // m/s^2
                buf.readInt16LE(0x10) / 100.0, // m/s^2
                buf.readInt16LE(0x12) / 100.0  // m/s^2
            );
        }
    };

    public generateDemoValue() {
        this.i += 0.1;
        this.emit(new IMUModelData(
            Math.cos(this.i)   + 3 * Math.sin(this.i/3),
            Math.sin(this.i/3) + 3 * Math.sin(this.i/5),
            Math.sin(this.i/5) + 3 * Math.sin(this.i/7),
            Math.sin(this.i)   + 3 * Math.sin(this.i/3),
            Math.sin(this.i/3) + 3 * Math.sin(this.i/5),
            Math.sin(this.i/5) + 3 * Math.sin(this.i/7),
            Math.sin(this.i/7) + 3 * Math.sin(this.i/11),
            Math.sin(this.i)   + 3 * Math.sin(this.i/3),
            Math.sin(this.i/3) + 3 * Math.sin(this.i/5),
            Math.sin(this.i/5) + 3 * Math.sin(this.i/7),
        ));
    }
}



/**
 * Defines the data handled by the IMUModel.
 * 
 * @author AWBirky
 */
export class IMUModelData extends ModelData {
    readonly Type = ModelDataType.IMU;
    
    /** Angular velocity in the X direction (rad/s). */
    readonly GyroX: number;

    /** Angular velocity in the Y direction (rad/s). */
    readonly GyroY: number;

    /** Angular velocity in the Z direction (rad/s). */
    readonly GyroZ: number;

    /** Quaternion angle W component (unitless). */
    readonly QuatW: number;

    /** Quaternion angle X component (unitless). */
    readonly QuatX: number;

    /** Quaternion angle Y component (unitless). */
    readonly QuatY: number;

    /** Quaternion angle Z component (unitless). */
    readonly QuatZ: number;

    /** Acceleration in the X direction (m/s^2). */
    readonly AccelX: number;

    /** Acceleration in the Y direction (m/s^2). */
    readonly AccelY: number;
    
    /** Acceleration in the Z direction (m/s^2). */
    readonly AccelZ: number;

    /**
     * Creates a new IMU data point.
     * @param gyroX Angular velocity in the X direction (deg/s).
     * @param gyroY Angular velocity in the Y direction (deg/s).
     * @param gyroZ Angular velocity in the Z direction (deg/s).
     * @param quatW Quaternion angle W component (unitless).
     * @param quatX Quaternion angle X component (unitless).
     * @param quatY Quaternion angle Y component (unitless).
     * @param quatZ Quaternion angle Z component (unitless).
     * @param accelX Acceleration in the X direction (m/s^2).
     * @param accelY Acceleration in the Y direction (m/s^2).
     * @param accelZ Acceleration in the Z direction (m/s^2).
     * @param timestamp Optional timestamp (defaults to current time).
     */
    constructor(
        gyroX: number,
        gyroY: number,
        gyroZ: number,
        quatW: number,
        quatX: number,
        quatY: number,
        quatZ: number,
        accelX: number,
        accelY: number,
        accelZ: number,
        timestamp?: EpochTimeStamp
    ) {
        super(timestamp);
        this.GyroX = gyroX;
        this.GyroY = gyroY;
        this.GyroZ = gyroZ;
        this.QuatW = quatW;
        this.QuatX = quatX;
        this.QuatY = quatY;
        this.QuatZ = quatZ;
        this.AccelX = accelX;
        this.AccelY = accelY;
        this.AccelZ = accelZ;
    }
}