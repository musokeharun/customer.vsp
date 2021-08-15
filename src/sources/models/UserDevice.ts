import ParseServer from "../implementaions/ParseServer";

class UserDevice extends ParseServer.Object {

    private isAdded: boolean = false;

    constructor() {
        super('UserDevice');
    }

    // NOTE ON LOGIN || REGISTER
    async addDevice(userId: string, brandName: string, modelName: string, osName: string, osVersion: string): Promise<UserDevice> {

        let query = new ParseServer.Query(UserDevice);
        query.equalTo("userId", userId);
        let devicesList = await query.find();
        let exists = devicesList.find(
            (dbDevice) =>
                dbDevice.get("brandName") === brandName && dbDevice.get("modelName") === modelName
                && dbDevice.get("osName") == osName && dbDevice.get("osVersion") === osVersion
        );

        if (exists) {
            exists.set("lastLoggedIn", new Date());
            return exists.save();
        }

        return this.save({
            userId,
            brandName,
            osName,
            modelName,
            osVersion,
            lastLoggedIn: new Date()
        })
    }

}

ParseServer.Object.registerSubclass('UserDevice', UserDevice);
export default UserDevice;