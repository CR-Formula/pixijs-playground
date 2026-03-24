import { Model, ModelData, ModelDataType, PacketType } from "./model";

/**
 * Models the data from the Suspension system.
 * 
 * @author AWBirky
 */
export class SuspensionModel extends Model<SuspensionModelData> {
    protected readonly packetHandlers = {
        // Suspension Packet
        [PacketType.Suspension]: (buf: Buffer) => {
            if (buf.length < 5) return null;
            
            return new SuspensionModelData(
                buf.readUInt16LE(1), // Front Pot
                buf.readUInt16LE(3)  // Rear Pot
            );
        }
    };

    public generateDemoValue() {
        this.i += 0.1;
        this.emit(new SuspensionModelData(
            50 * Math.cos(this.i/10) + 50,
            50 * Math.cos(this.i/15) + 50
        ));
    }
}



/**
 * Defines the data handled by the SuspensionModel.
 * 
 * @author AWBirky
 */
export class SuspensionModelData extends ModelData {
    readonly Type = ModelDataType.Suspension;

    /** Potentiometer value for the front right damper. */
    readonly FrontPot: number;
    
    /** Potentiometer value for the rear right damper. */
    readonly RearPot: number;

    /**
     * Creates a new Suspension data point.
     * @param frontPot Potentiometer value for the front right damper.
     * @param rearPot Potentiometer value for the rear right damper.
     * @param timestamp Optional timestamp (defaults to current time).
     */
    constructor(
        frontPot: number,
        rearPot: number,
        timestamp?: EpochTimeStamp
    ) {
        super(timestamp);
        this.FrontPot = frontPot;
        this.RearPot = rearPot;
    }
}