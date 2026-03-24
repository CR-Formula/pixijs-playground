import { Model, ModelData, ModelDataType, PacketType } from "./model";

/**
 * Models the data from the GPS system.
 * 
 * @author AWBirky
 */
export class GPSModel extends Model<GPSModelData> {
    protected readonly packetHandlers = {
        // GPS Packet
        [PacketType.GPS]: (buf: Buffer) => {
            if (buf.length < 13) return null;

            return new GPSModelData(
                buf.readInt32LE(1) / 100000000,
                buf.readInt32LE(5) / 100000000,
                buf.readUInt32LE(9)
            );
        }
    };

    public generateDemoValue() {
        this.i += 0.1;
        this.emit(new GPSModelData(
            Math.cos(this.i) + 3 * Math.sin(this.i/5),
            Math.sin(this.i/3) + 3 * Math.sin(this.i/4),
            20 * Math.cos(this.i/10) + 50
        ));
    }
}



/**
 * Defines the data handled by the GPSModel.
 * 
 * @author AWBirky
 */
export class GPSModelData extends ModelData {
    readonly Type = ModelDataType.GPS;

    /** GPS latitude position. */
    readonly Latitude: number;

    /** GPS longitude position. */
    readonly Longitude: number;
    
    /** Vehicle speed, measured by the GPS. */
    readonly Speed: number;

    /**
     * Creates a new GPS data point.
     * @param latitude GPS latitude position.
     * @param longitude GPS longitude position.
     * @param speed Vehicle speed, measured by the GPS.
     * @param timestamp Optional timestamp (defaults to current time).
     */
    constructor(
        latitude: number,
        longitude: number,
        speed: number,
        timestamp?: EpochTimeStamp
    ) {
        super(timestamp);
        this.Latitude = latitude;
        this.Longitude = longitude;
        this.Speed = speed;
    }
}