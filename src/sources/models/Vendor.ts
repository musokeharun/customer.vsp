import ParseServer from "../implementaions/ParseServer";

const Vendor = ParseServer.Object.extend("Vendor");

export const addVendor = async (
  name: string,
  contact: string,
  email: string,
  image: string = "",
  link: string = "",
  desc: string = "",
  social: Array<any> = []
) => {
  let vendor: ParseServer.Object = new Vendor();
  return vendor.save({
    name,
    contact,
    email,
    image,
    link,
    desc,
    social,
  });
};

export default Vendor;
