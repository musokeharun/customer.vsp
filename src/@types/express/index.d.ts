import { IUser } from "@entities/User";
import { IClientData } from "@shared/JwtService";

declare module "express" {
  export interface Request {
    body: {
      user: IUser;
      email: string;
      password: string;
      message: string;
      socketId: string;
      deviceId: string;
      device: any;
      contact: string;
      code: string;
      name: string;
      email: string;
      desc: string;
      image: string;
      isActive: string;
    };
  }
}

declare global {
  namespace Express {
    export interface Response {
      sessionUser: IClientData;
    }
  }
}
