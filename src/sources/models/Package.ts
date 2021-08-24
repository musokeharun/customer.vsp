import ParseServer from "../implementaions/ParseServer";

const Package = ParseServer.Object.extend("Package");

export const addPackage = async (
  name: string,
  isActive: boolean,
  deviceCount: number,
  concurrentDeviceCount: number,
  downloadLimit: number,
  expirationDuration: number,
  user: ParseServer.Object | null
): Promise<typeof Package> => {
  let packag: ParseServer.Object = new Package();
  return packag.save({
    name,
    isActive,
    deviceCount,
    concurrentDeviceCount,
    downloadLimit,
    expirationDuration,
    user,
  });
};

export default Package;
