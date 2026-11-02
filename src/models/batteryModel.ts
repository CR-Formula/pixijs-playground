import { Model, ModelData, ModelDataType, PacketType } from "./model";

/**
 * Models the data from the Orion BMS.
 * 
 * @author AWBirky
 */
export class BatteryModel extends Model<BatteryModelData> {
    protected readonly packetHandlers = {
        // BattVolt Packet
        [PacketType.BattVolt]: (buf: Buffer) => {
            if (buf.length < 2) return null;

            const c = this.getCurrentData();
            if (!c) return null;

            const cellVolts = [];
            for (let i = 0; i < buf.length; i += 2)
                cellVolts.push(buf.readUint8(i) * 0.0256); // 0-5V

            return new BatteryModelData(
                cellVolts,
                c ? c.CellTemps : []
            );
        },

        // BattTemp Packet
        [PacketType.BattTemp]: (buf: Buffer) => {
            if (buf.length < 2) return null;

            const c = this.getCurrentData();
            if (!c) return null;

            const cellTemps = [];
            for (let i = 0; i < buf.length; i += 2)
                cellTemps.push(buf.readInt8(i)); // 1C

            return new BatteryModelData(
                c ? c.CellVolts : [],
                cellTemps
            );
        }
    };

    public generateDemoValue() {
        this.i += 0.3;
        const voltCount = 140;
        const voltages = Array.from({ length: voltCount }, (_, idx) =>
            3.7 + 0.05 * Math.sin(this.i / 10 + idx * 0.4) + 0.0025 * (idx - voltCount / 2)
        );
        const tempCount = 28;
        const temps = Array.from({ length: tempCount }, (_, idx) =>
            25 + 2 * Math.sin(this.i / 12 + idx * 0.6) + 0.1 * ((idx % 3) - 1)
        );

        this.emit(new BatteryModelData(
            voltages,
            temps
        ));
    }
}



/**
 * Defines the data handled by the BatteryModel.
 * 
 * @author AWBirky
 */
export class BatteryModelData extends ModelData {
    readonly Type = ModelDataType.Battery;

    /** Cell voltages (V). */
    readonly CellVolts: number[];

    /** Cell temperatures (C). */
    readonly CellTemps: number[];

    /**
     * Creates a new Battery data point.
     * @param cellVolts Cell voltages (V).
     * @param cellTemps Cell temperatures (C).
     * @param timestamp Optional timestamp (defaults to current time).
     */
    constructor(
        cellVolts: number[],
        cellTemps: number[],
        timestamp?: EpochTimeStamp
    ) {
        super(timestamp);
        this.CellVolts = cellVolts;
        this.CellTemps = cellTemps;
    }
}