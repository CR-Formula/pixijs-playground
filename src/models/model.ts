import { EventEmitter } from "events";

/**
 * Defines a base class for all data models, handling LoRa packet parsing.
 * 
 * @param T The ModelData type used by this model.
 * @author AWBirky
 */
export abstract class Model<T extends ModelData> {
    ////////// Data Parsing and Storage //////////

    /** Dictionary storing the handlers corresponding to each supported packet type. */
    protected abstract readonly packetHandlers: Record<number, (buf: Buffer, timestamp?: number) => T | null>;

    /** History of parsed data. */
    private dataHistory: T[] = [];

    /**
     * Tries to parse a LoRa packet buffer into data if it is supported by the model.
     * @param buf The buffer containing the LoRa packet data.
     * @returns True if successful, false otherwise.
     */
    public tryParseData(buf: Buffer, timestamp?: number): boolean {
        if (this.supportsPacketType(buf[0])) {
            const data = this.packetHandlers[buf[0]](buf, timestamp);

            if (data != null) {
                this.emit(data);
                return true;
            }
        }

        return false;
    }

    /**
     * Checks if the model supports the given packet type.
     * @param packetType The packet type identifier to check for support.
     * @returns True if the model supports the packet type, false otherwise.
     */
    public supportsPacketType(packetType: PacketType): boolean {
        return this.packetHandlers[packetType] != undefined;
    }



    ////////// Data Reading //////////

    /**
     * Gets the most recently parsed data.
     * @returns The most recent data point, or null if there are none.
     */
    public getCurrentData(): T | null {
        return this.dataHistory.length > 0 ?
            this.dataHistory[this.dataHistory.length - 1] : null;
    }

    /**
     * Gets a portion of the most recent data points.
     * @param length The number of data points to try to return from the history.
     * @returns An array of data up to the length provided.
     */
    public getDataHistory(length?: number): T[] {
        return length ? this.dataHistory.slice(-length) : this.dataHistory;
    }



    ////////// Data Notifications //////////

    /** Handles notifying data added to the model. */
    protected emitter: EventEmitter = new EventEmitter();
    
    /**
     * Sends an event to notify listeners that data was added to the model.
     * @param data The ModelData added to this Model.
     */
    protected emit(data: T) {
        this.dataHistory.push(data);
        this.emitter.emit('modelData', data);
    }

    /**
     * Subscribes to the event called when data is successfully added to the model.
     * @param listener The function to run when data is added.
     */
    public onDataAdded(listener: (data: T) => void) {
        this.emitter.on('modelData', listener);
    }



    ////////// Demo Values //////////

    /** Counter for demo values. */
    protected i: number = 0;

    /**
     * Generates a demo value for this model (for debugging).
     */
    public abstract generateDemoValue(): void;
}



/**
 * Defines a generic case for telemetry data stored by a model.
 * 
 * @author AWBirky
 */
export abstract class ModelData {
    /** The type of data. */
    abstract readonly Type: ModelDataType;
    
    public abstract get properties(): Record<string, (data: ModelData) => any>;
    
    /** Time at which this packet was received. */
    readonly Timestamp: EpochTimeStamp;

    /**
     * Creates a generic data point with a timestamp.
     * @param timestamp Optional timestamp (defaults to current time).
     */
    constructor(timestamp?: EpochTimeStamp) {
        this.Timestamp = timestamp ?? Date.now();
    }
}



/**
 * Defines the types of data that can be stored by a model.
 * Used for indexing Dataset entries.
 * 
 * @author AWBirky
 */
export enum ModelDataType {
    Suspension,
    GPS,
    Engine,
    BrakesAccel,
    Temperature
}

/**
 * Enum for packet types (first byte of each LoRa packet).
 * 
 * @author AWBirky
 */
export enum PacketType {
  Suspension = 0x01,
  GPS = 0x02,
  EngineData = 0x03,
  BrakesAccel = 0x04,
  Temperature = 0x05,
}