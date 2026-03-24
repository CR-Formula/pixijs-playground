import { Model, ModelData, ModelDataType } from "./model.ts";
import { BrakesAccelModel } from "./brakesAccelModel.ts";
import { EngineModel } from "./engineDataModel.ts";
import { GPSModel } from "./gpsModel.ts";
import { SuspensionModel } from "./suspensionModel.ts";
import { TemperatureModel } from "./temperatureModel.ts";
import { EventEmitter } from "events";

/**
 * Handles the combination of all the models for the car.
 * 
 * @author AWBirky
 */
export default class TelemetryModel {
    /** List of models to handle various systems. */
    private readonly models: Model<ModelData>[] = [
        new SuspensionModel(),
        new GPSModel(),
        new EngineModel(),
        new BrakesAccelModel(),
        new TemperatureModel()
    ];
    
    /** Handles passing data to the server. */
    private emitter: EventEmitter = new EventEmitter();

    /**
     * Creates an instance of the TelemetryModel, setting up all individual models.
     */
    public constructor() {
        // Set up event listeners
        for (const model of this.models)
            model.onDataAdded((data) => {this.emitter.emit('telemData', data)});
    }

    /**
     * Subscribes to the event called when data is successfully processed by this model.
     * @param listener The function to run when data is processed by this model.
     */
    public onDataProcessed(listener: (data: ModelData) => void) {
        this.emitter.on('telemData', listener);
    }

    /**
     * Attempts to parse the given LoRa packet buffer.
     */
    public parseData(buf: Buffer) {
        for (const model of this.models) {
            // Break early once successful
            if (model.tryParseData(buf)) return;
        }
    }

    /**
     * Gets the history of all data points from each model.
     * @param length Optional; the maximum number of data points to retrieve.
     * @returns The combined dataset of all model histories.
     */
    public getAllHistory(length?: number): Dataset {
        var history: Dataset = new Dataset();

        for (const model of this.models) {
            history.initSet(model.getDataHistory(length));
        }

        return history;
    }



    ////////// Demo Mode //////////

    /** The interval for the demo run. */
    private demoRun: NodeJS.Timeout;

    /**
     * Starts generating demo values for all models at the provided interval.
     * @param interval The time (ms) between generating demo values (defaults to 20 ms).
     */
    public startDemo(interval: number = 20) {
        this.demoRun = setInterval(() => {
            for (const model of this.models) {
                model.generateDemoValue();
            }
        }, interval);
    }

    /**
     * Stops generating demo values for all models.
     */
    public stopDemo() {
        clearInterval(this.demoRun);
    }
    
}



/**
 * Holds the data arrays from each model, indexed by their ModelDataType.
 * 
 * @author AWBirky
 */
export class Dataset {
    /** The list of data arrays. */
    private dataset: ModelData[][] = [];
    
    /**
     * Adds an existing data array to this Dataset.
     * If a set already exists, it will be overwritten.
     * @param set The data array to initialize.
     */
    public initSet(set: ModelData[]) {
        if (set.length <= 0) return;

        // Infer type from first element
        var type = set[0].Type;

        this.dataset[type] = set;
    }

    /**
     * Adds a data point to the appropriate set in this Dataset, based on its type.
     * Old entries can be removed by providing maxSetSize.
     * @param data The data point to add.
     * @param maxSetSize Optional; the maximum history to limit the data array to.
     */
    public addDataPoint(data: ModelData, maxSetSize?: number) {
        var type = data.Type;

        if (!this.dataset[type]) this.dataset[type] = [];
        this.dataset[type].push(data);

        if (maxSetSize) this.dataset[type] = this.dataset[type].slice(-maxSetSize);
    }

    /**
     * Gets the data array for the given type.
     * @param type The data array to get.
     * @returns The requested data array, or an empty array if it doesn't exist.
     */
    public getSet(type: ModelDataType): ModelData[] {
        return this.dataset[type] ?? [];
    }

    /**
     * Gets a portion of the most recent data points for the given type.
     * @param type The data array to get.
     * @param length The maximum number of recent data points to retrieve.
     * @returns The set up to the specified length, or an empty array if it doesn't exist.
     */
    public getSetHistory(type: ModelDataType, length: number) {
        return this.getSet(type).slice(-length);
    }
}