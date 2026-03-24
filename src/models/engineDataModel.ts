import { Model, ModelData, ModelDataType, PacketType } from "./model";

/**
 * Models the data from the Engine.
 * 
 * @author AWBirky
 */
export class EngineModel extends Model<EngineModelData> {
    protected readonly packetHandlers = {
        // Engine Data Packet
        [PacketType.EngineData]: (buf: Buffer) => {
            if (buf.length < 13) return null;

            return new EngineModelData(
                buf.readUInt16LE(1), // Brake Pressure
                buf.readUInt16LE(3), // Throttle ADC
                buf.readUInt16LE(5), // Steering
                buf.readUInt16LE(7), // RPM
                buf.readUInt16LE(9), // Throttle Position Sensor
                buf.readUInt16LE(11) // Lambda
            );
        }
    };

    public generateDemoValue() {
        this.i += 0.1;
        this.emit(new EngineModelData(
            50 * Math.cos(this.i/10) + 50,
            50 * Math.cos(this.i/15) + 50,
            30 * Math.cos(this.i/20) + 30,
            2000 * Math.cos(this.i/25) + 4000,
            50 * Math.cos(this.i/30) + 50,
            50 * Math.cos(this.i/35) + 50
        ));
    }
}



/**
 * Defines the data handled by the EngineModel.
 * 
 * @author AWBirky
 */
export class EngineModelData extends ModelData {
    readonly Type = ModelDataType.Engine;

    /** Recorded pressure of the brakes. */
    readonly BrakePressure: number;
    
    /** Analog throttle position. */
    readonly ThrottleADC: number;
    
    /** Steering angle. */
    readonly Steering: number;
    
    /** RPM of the engine. */
    readonly RPM: number;
    
    /** Throttle position from ECU. */
    readonly ThrottlePosSensor: number;
    
    /** Unknown value. */
    readonly Lambda: number;

    /**
     * Creates a new Engine/Controls data point.
     * @param brakePressure Recorded pressure of the brakes.
     * @param throttleADC Analog throttle position.
     * @param steering Steering angle.
     * @param rpm RPM of the engine.
     * @param throttlePosSensor Throttle position from ECU.
     * @param lambda (Unknown)
     * @param timestamp Optional timestamp (defaults to current time).
     */
    constructor(
        brakePressure: number,
        throttleADC: number,
        steering: number,
        rpm: number,
        throttlePosSensor: number,
        lambda: number,
        timestamp?: EpochTimeStamp
    ) {
        super(timestamp);
        this.BrakePressure = brakePressure;
        this.ThrottleADC = throttleADC;
        this.Steering = steering;
        this.RPM = rpm;
        this.ThrottlePosSensor = throttlePosSensor;
        this.Lambda = lambda;
    }
}