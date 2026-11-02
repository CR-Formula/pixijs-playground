import { Model, ModelData, ModelDataType, PacketType } from "./model";

/**
 * Models the data from the Inverter.
 * 
 * @author AWBirky
 */
export class InverterModel extends Model<InverterModelData> {
    protected readonly packetHandlers = {
        // Inverter Packet
        [PacketType.Inverter]: (buf: Buffer) => {
            if (buf.length < 0x0C) return null;

            return new InverterModelData(
                buf.readUint8   (0x00),
                buf.readUint8   (0x01),
                buf.readUint32LE(0x02),
                buf.readUint16LE(0x06),
                buf.readInt16LE (0x08),
                buf.readInt8    (0x0A),
                buf.readUint8   (0x0B)
            );
        }
    };

    public generateDemoValue() {
        this.i += 0.1;
        this.emit(new InverterModelData(
            Math.cos(this.i) + 3 * Math.sin(this.i/5),
            Math.sin(this.i/3) + 3 * Math.sin(this.i/4),
            20 * Math.cos(this.i/10) + 50,
            Math.cos(this.i/2) + 100,
            Math.sin(this.i/3) + 20,
            Math.cos(this.i/4) + 50,
            Math.sin(this.i/5) + 75
        ));
    }
}



/**
 * Defines the data handled by the InverterModel.
 * 
 * @author AWBirky
 */
export class InverterModelData extends ModelData {
    readonly Type = ModelDataType.Inverter;

    /** Controller temperature (C). */
    readonly ControllerTemp: number;

    /** Motor temperature (C). */
    readonly MotorTemp: number;
    
    /** Electrical RPM. */
    readonly ERPM: number;

    /** Input voltage (V). */
    readonly InputVoltage: number;

    /** DC current (A). */
    readonly DCCurrent: number;

    /** Throttle position (%). */
    readonly Throttle: number;

    /** Fault code. */
    readonly FaultCode: number;

    /**
     * Creates a new Inverter data point.
     * @param controllerTemp Controller temperature (C).
     * @param motorTemp Motor temperature (C).
     * @param erpm Electrical RPM.
     * @param inputVoltage Input voltage (V).
     * @param dccurrent DC current (A).
     * @param throttle Throttle position (%).
     * @param faultCode Fault code.
     * @param timestamp Optional timestamp (defaults to current time).
     */
    constructor(
        controllerTemp: number,
        motorTemp: number,
        erpm: number,
        inputVoltage: number,
        dccurrent: number,
        throttle: number,
        faultCode: number,
        timestamp?: EpochTimeStamp
    ) {
        super(timestamp);
        this.ControllerTemp = controllerTemp;
        this.MotorTemp = motorTemp;
        this.ERPM = erpm;
        this.InputVoltage = inputVoltage;
        this.DCCurrent = dccurrent;
        this.Throttle = throttle;
        this.FaultCode = faultCode;
    }
}