import { appLogger } from "@shared/Logger";
import axios from "axios";
import config from "config";

export interface SmsHandler {
  contacts: string;
  message: string;
  sender: string;

  send(): Promise<any>;
}

export class CaltonHandler implements SmsHandler {
  contacts: string;
  message: string;
  sender: string;

  constructor(contacts: string, message: string, sender: string) {
    this.contacts = contacts;
    this.message = message;
    this.sender = sender;
  }

  async send(): Promise<any> {
    const { username, password, sender } = config.get("Calton");

    const contacts: string[] = this.contacts.split(",");

    try {
      let { data } = await axios.get(
        `http://caltonmobile.com/calton/api.php?sender=${sender}&contacts=256752600665&message=${contacts[0]}&username=${username}&password=${password}`
      );

      if (data == "400") {
        //log
        // appLogger;
        return Promise.resolve({
          sent: true,
          meta: "Successfully sent",
          code: data,
        });
      }
      return Promise.resolve({
        sent: false,
        meta: "Some error occured",
        code: data,
      });
    } catch (error) {
      return Promise.reject({
        sent: false,
        meta: "Some error occured",
        code: undefined,
      });
    }
  }

  sendMultiple(): Promise<any> {
    return axios.get("");
  }
}

class TwilioHandler implements SmsHandler {
  contacts: string;
  message: string;
  sender: string;

  constructor(contacts: string, message: string, sender: string) {
    this.contacts = contacts;
    this.message = message;
    this.sender = sender;
  }

  send(): Promise<any> {
    return axios.get("http://caltonmobile.com/calton/api.php");
  }
}
