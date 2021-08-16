import axios from "axios";

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

  send(): Promise<any> {
    return axios.get("http://caltonmobile.com/calton/api.php");
  }
}
