import { Request, Response } from "express";
import {
  LogAction,
  LogType,
  VSPLog,
} from "../sources/implementaions/ParseServer";
import { ExpoDevice } from "@entities/Device";
import { StatusCodes } from "http-status-codes";
import { welcomeMessage } from "@shared/constants";
import logger from "@shared/Logger";
import { VSPExpoDevice } from "src/sources/models/UserDevice";

export const logDevice = async (req: Request, res: Response) => {
  const { device, deviceId } = req.body;

  // log to database
  const vspExpoDevice = new VSPExpoDevice();
  console.log(device);
  const expoDevice = ExpoDevice.fromJSON(
    deviceId || "N/A",
    JSON.stringify(device) || "{}"
  );
  const objectFromDevice = Object.assign(expoDevice, {});

  console.log("Object-Got-From", objectFromDevice);
  // res.json(objectFromDevice);

  //add to user-devices-used-logs
  try {
    const savedDeviceLog = await vspExpoDevice.save({ ...objectFromDevice });
    console.log(savedDeviceLog);

    if (!deviceId) {
      return res
        .status(StatusCodes.CREATED)
        .json({ msg: welcomeMessage })
        .end();
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
};
