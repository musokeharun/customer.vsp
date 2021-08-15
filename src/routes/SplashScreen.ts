import {Request, Response} from "express";
import {LogAction, LogType, VSPExpoDevice, VSPLog} from "../sources/implementaions/ParseServer";
import {ExpoDevice} from "@entities/Device";
import {StatusCodes} from "http-status-codes";
import {welcomeMessage} from "@shared/constants";
import logger from "@shared/Logger";

export const logOpen = async (req: Request, res: Response) => {

    const {device, deviceId} = req.body;

    // log to database
    let vspExpoDevice = new VSPExpoDevice();
    console.log(device);
    let expoDevice = ExpoDevice.fromJSON(deviceId || "N/A", JSON.stringify(device) || "{}");
    let objectFromDevice = Object.assign(expoDevice, {});

    console.log("Object-Got-From", objectFromDevice);
    // res.json(objectFromDevice);

    //add to user-devices-used-logs
    try {
        let savedDeviceLog = await vspExpoDevice.save({...objectFromDevice});
        console.log(savedDeviceLog);

        if (!deviceId) {
            return res.status(StatusCodes.CREATED).json({msg: welcomeMessage}).end();
        }

        // respond with device-notification
        //TODO TELL USER ABOUT DEVICES LOGGED IN || ASYNC

        // TODO SOCKET IO ADD GENERAL ROOM

        // TODO EMIT ALERT THROUGH MY SOCKET ID

        res.json({});

    } catch (e) {
        logger.err(e);
        await VSPLog(LogType.ERROR, LogAction.INSERT, undefined, deviceId);
        res.json({});
    }

}