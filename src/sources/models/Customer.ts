import ParseServer from "../implementaions/ParseServer";
import { encrypt } from "@shared/encrypt";
import { getNetworkType } from "@shared/networkUtils";

const Customer = ParseServer.Object.extend("Customer");
const CustomerMovie = ParseServer.Object.extend("CustomerMovies");
const CustomerDownload = ParseServer.Object.extend("CustomerDownload");

export const addCustomer = async (
  email: string | undefined,
  contact: string | undefined,
  password: string,
  code: string | number
): Promise<typeof Customer> => {
  const customer = new Customer();
  customer.set("email", email);
  customer.set("contact", contact);
  customer.set("password", encrypt(password));
  customer.set("isVerified", false);
  customer.set("network", getNetworkType(contact));
  customer.set("code", code);
  customer.set("isActive", true);
  //TODO ADD GOOGLE TOKEN
  return customer.save();
};

export const addToList = (
  vod: string,
  customer: typeof Customer,
  added: Date
): Promise<typeof CustomerMovie> => {
  let customerMovie: ParseServer.Object = new CustomerMovie();
  return customerMovie.save({
    vod,
    customer,
    added,
  });
};

export const addToDownload = (
  vod: string,
  customer: string,
  device: string,
  finished: boolean = false
): Promise<typeof CustomerDownload> => {
  let download: ParseServer.Object = new CustomerDownload();
  return download.save({
    vod,
    customer,
    device,
    finished,
  });
};

export default Customer;
