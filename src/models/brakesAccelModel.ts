import { Model, ModelData, ModelDataType, PacketType } from "./model";

/**
 * Models the data from the brakes and accelerometer.
 * 
 * @author AWBirky
 */
export class BrakesAccelModel extends Model<BrakesAccelModelData> {
    protected readonly packetHandlers = {
        // Brake/Acceleration Packet
        [PacketType.BrakesAccel]: (buf: Buffer) => {
            if (buf.length < 13) return null;

            return new BrakesAccelModelData(
                buf.readUInt16LE(1), // Oil Pressure
                buf.readUInt16LE(3), // Front Brake Temp
                buf.readUInt16LE(5), // Rear Brake Temp
                buf.readUInt16LE(7), // Accel X
                buf.readUInt16LE(9), // Accel Y
                buf.readUInt16LE(11) // Accel Z
            );
        }
    };

    public generateDemoValue() {
        this.i += 0.1;
        this.emit(new BrakesAccelModelData(
            50 * Math.cos(this.i/10) + 50,
            50 * Math.cos(this.i/15) + 50,
            50 * Math.cos(this.i/20) + 50,
            50 * Math.cos(this.i/25) + 50,
            50 * Math.cos(this.i/30) + 50,
            50 * Math.cos(this.i/35) + 50
        ));
    }
}



/**
 * Defines the data handled by the BrakesAccelModel.
 * 
 * @author AWBirky
 */
export class BrakesAccelModelData extends ModelData {
    readonly Type = ModelDataType.BrakesAccel;

    /** Pressure of the oil. */
    OilPressure: number;
    
    /** Front right brake temperature. */
    FrontBrakeTemp: number;
    
    /** Rear right brake temperature. */
    RearBrakeTemp: number;
    
    /** Accelerometer X axis. */
    AccelX: number;
    
    /** Accelerometer Y axis. */
    AccelY: number;
    
    /** Accelerometer Z axis. */
    AccelZ: number;

    /**
     * Creates a new Brake/Acceleration data point.
     * @param oilPressure Pressure of the oil.
     * @param frontBrakeTemp Front right brake temperature.
     * @param rearBrakeTemp Rear right brake temperature.
     * @param accelX Accelerometer X axis.
     * @param accelY Accelerometer Y axis.
     * @param accelZ Accelerometer Z axis.
     * @param timestamp Optional timestamp (defaults to current time).
     */
    constructor(
        oilPressure: number,
        frontBrakeTemp: number,
        rearBrakeTemp: number,
        accelX: number,
        accelY: number,
        accelZ: number,
        timestamp?: EpochTimeStamp
    ) {
        super(timestamp);
        this.OilPressure = oilPressure;
        this.FrontBrakeTemp = frontBrakeTemp;
        this.RearBrakeTemp = rearBrakeTemp;
        this.AccelX = accelX;
        this.AccelY = accelY;
        this.AccelZ = accelZ;
    }
}