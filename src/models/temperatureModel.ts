import { Model, ModelData, ModelDataType, PacketType } from "./model";

/**
 * Models the data from the temperature system.
 * 
 * @author AWBirky
 */
export class TemperatureModel extends Model<TemperatureModelData> {
    protected readonly packetHandlers = {
        [PacketType.Temperature]: (buf: Buffer) => {
            if (buf.length < 5) return null;

            return new TemperatureModelData(
                buf.readInt16LE(1), // Air Temp
                buf.readInt16LE(3)  // Coolant Temp
            )
        }
    };

    public generateDemoValue() {
        this.i += 0.1;
        this.emit(new TemperatureModelData(
            50 * Math.cos(this.i/10) + 50,
            50 * Math.cos(this.i/15) + 50
        ));
    }
}



/**
 * Defines the data handled by the TemperatureModel.
 * 
 * @author AWBirky
 */
export class TemperatureModelData extends ModelData {
    readonly Type = ModelDataType.Temperature;

    /** Air temperature. */
    AirTemp: number;

    /** Coolant temperature. */
    CoolTemp: number;

    /**
     * Creates a new temperature data point.
     * @param airTemp Air temperature.
     * @param coolTemp Coolant temperature.
     * @param timestamp Optional timestamp (defaults to current time).
     */
    constructor(
        airTemp: number,
        coolTemp: number,
        timestamp?: EpochTimeStamp
    ) {
        super(timestamp);
        this.AirTemp = airTemp;
        this.CoolTemp = coolTemp;
    }
}