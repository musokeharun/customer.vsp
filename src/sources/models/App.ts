import ParseServer from "../implementaions/ParseServer";

const AppStatic = ParseServer.Object.extend("AppStatic");

export const addAppStatics = (
  welcomeText: string,
  welcomeBg: string,
  welcomeLogo: string
): Promise<typeof AppStatic> => {
  let statics: ParseServer.Object = new AppStatic();
  return statics.save({
    welcomeText,
    welcomeBg,
    welcomeLogo,
  });
};

export default AppStatic;
