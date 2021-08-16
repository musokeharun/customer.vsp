export interface EmailHandler {
  email: string;
  body: string;
  title: string;

  send(): Promise<boolean>;
}

export default class ServerEmailService implements EmailHandler {
  email: string;
  body: string;
  title: string;

  constructor(email: string, body: string, title: string) {
    this.email = email;
    this.body = body;
    this.title = title;
  }

  send(): Promise<boolean> {
    return new Promise(() => true);
  }
}
