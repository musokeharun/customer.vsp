import ParseServer from "../implementaions/ParseServer";
import { encrypt } from "@shared/encrypt";
import { getNetworkType } from "@shared/networkUtils";

const Customer = ParseServer.Object.extend("Customer");

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
  return customer.save();
};

export default Customer;
