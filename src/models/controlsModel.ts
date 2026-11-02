import { Model, ModelData, ModelDataType, PacketType } from "./model";

/**
 * Models the data from various Controls sensors.
 * 
 * @author AWBirky
 */
export class ControlsModel extends Model<ControlsModelData> {
    protected readonly packetHandlers = {
        // Controls Packet
        [PacketType.Controls]: (buf: Buffer) => {
            if (buf.length < 3) return null;

            return new ControlsModelData(
                buf.readUint8(0x00) * 15,   // 15 PSI
                buf.readUint8(0x01) / 2.55, // 0-100%
                buf.readUint8(0x02) / 2.55  // 0-100%
            );
        }
    };

    public generateDemoValue() {
        this.i += 0.1;
        this.emit(new ControlsModelData(
            1500 * Math.sin(this.i/10) + 1500,
            0.5 * Math.cos(this.i/10) + 0.5,
            0.49 * Math.cos(this.i/10) + 0.5 + 0.01 * Math.sin(this.i/5),
        ));
    }
}



/**
 * Defines the data handled by the ControlsModel.
 * 
 * @author AWBirky
 */
export class ControlsModelData extends ModelData {
    readonly Type = ModelDataType.Controls;

    /** Brake pressure (PSI). */
    readonly BrakePressure: number;

    /** Throttle value from the first sensor (%). */
    readonly ThrottleRaw1: number;
    
    /** Throttle value from the second sensor (%). */
    readonly ThrottleRaw2: number;

    /**
     * Creates a new Controls data point.
     * @param brakePressure Brake pressure (PSI).
     * @param throttleRaw1 Throttle value from the first sensor (%).
     * @param throttleRaw2 Throttle value from the second sensor (%).
     * @param timestamp Optional timestamp (defaults to current time).
     */
    constructor(
        brakePressure: number,
        throttleRaw1: number,
        throttleRaw2: number,
        timestamp?: EpochTimeStamp
    ) {
        super(timestamp);
        this.BrakePressure = brakePressure;
        this.ThrottleRaw1 = throttleRaw1;
        this.ThrottleRaw2 = throttleRaw2;
    }
}