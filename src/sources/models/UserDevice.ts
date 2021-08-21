import ParseServer from "../implementaions/ParseServer";

export const UserDevice = ParseServer.Object.extend("UserDevice");
export const VSPExpoDevice = ParseServer.Object.extend("VSPExpoDevice");

// FIXME ON LOGIN || REGISTER
export const addDevice = async (
  userId: string,
  brandName: string,
  modelName: string,
  osName: string,
  osVersion: string
): Promise<typeof UserDevice> => {
  let query = new ParseServer.Query(UserDevice);
  query.equalTo("userId", userId);
  let devicesList = await query.find();
  let exists = devicesList.find(
    (dbDevice) =>
      dbDevice.get("brandName") === brandName &&
      dbDevice.get("modelName") === modelName &&
      dbDevice.get("osName") == osName &&
      dbDevice.get("osVersion") === osVersion
  );

  if (exists) {
    exists.set("lastLoggedIn", new Date());
    return exists.save();
  }

  let createdDevice = new UserDevice();
  return createdDevice.save({
    userId,
    brandName,
    osName,
    modelName,
    osVersion,
    lastLoggedIn: new Date(),
  });
};

export default UserDevice;
