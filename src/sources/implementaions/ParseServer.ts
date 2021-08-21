import ParseServer from "parse/node";

ParseServer.initialize(
  process.env.VSP_APP_ID || "cUDxUShp1giStwYtTf5MnwEpLNHHD13DF1ZsCpqm",
  process.env.VSP_JS_ID || "XnnELBZsP1m5YwcSKtHzsMbMTOZNAzycYMh3pIEe"
);
ParseServer.serverURL =
  process.env.SERVER_URL || "https://parseapi.back4app.com/";

export default ParseServer;
//OBJECTS - TABLES
const VSPLogger = ParseServer.Object.extend("VSPLogger");

export enum LogType {
  ERROR,
  DEBUG,
  SUCCESS,
  INFO,
  WARNING,
  CRITICAL,
}

export enum LogAction {
  GET,
  INSERT,
  UPDATE,
  DELETE,
  DISABLE,
  ENABLE,
}

export const VSPLog = async (
  type: LogType,
  action: LogAction,
  userId?: string,
  customerId?: string,
  params1?: any,
  params2?: any,
  params3?: any,
  params4?: any
) => {
  const log = new VSPLogger();
  return log.save({
    type,
    action,
    userId,
    customerId,
    params1,
    params2,
    params3,
    params4,
  });
};
