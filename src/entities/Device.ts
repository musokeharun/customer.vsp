interface Device {
    isDevice?: boolean,
    brand?: string,
    manufacturer?: string,
    modelName?: string,
    modelId?: string,
    designName?: string,
    productName?: string,
    totalMemory?: string,
    supportedCpuArchitectures?: string,
    osName?: string,
    osVersion?: string,
    platformApiLevel?: string,
    deviceName?: string,
}


export class ExpoDevice implements Device {
    brand: string;
    designName: string;
    deviceName: string;
    isDevice: boolean;
    manufacturer: string;
    modelId: string;
    modelName: string;
    osName: string;
    osVersion: string;
    platformApiLevel: string;
    productName: string;
    supportedCpuArchitectures: string;
    totalMemory: string;
    deviceId: string;


    constructor(deviceId: string, deviceObject: any) {
        this.brand = deviceObject.brand;
        this.designName = deviceObject.designName;
        this.deviceName = deviceObject.deviceName;
        this.isDevice = deviceObject.isDevice;
        this.manufacturer = deviceObject.manufacturer;
        this.modelId = deviceObject.modelId;
        this.modelName = deviceObject.modelName;
        this.osName = deviceObject.osName;
        this.osVersion = deviceObject.osVersion;
        this.platformApiLevel = deviceObject.platformApiLevel;
        this.productName = deviceObject.productName;
        this.supportedCpuArchitectures = deviceObject.supportedCpuArchitectures;
        this.totalMemory = deviceObject.totalMemory
        this.deviceId = deviceId;
    }

    static fromJSON(deviceID: string, json: string): Device {
        return new ExpoDevice(deviceID, JSON.parse(json));
    }
}