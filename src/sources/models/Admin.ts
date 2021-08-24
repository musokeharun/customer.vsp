import ParseServer from "../implementaions/ParseServer";

const Admin = ParseServer.Object.extend("Admin");

export const addAdmin = (
  name: string,
  email: string,
  secret: string | "",
  isActive: boolean,
  password: string,
  image: ParseServer.File | undefined
): Promise<typeof Admin> => {
  let admin: ParseServer.Object = new Admin();
  return admin.save({
    name,
    email,
    secret,
    isActive,
    password,
    image,
  });
};

export default Admin;
