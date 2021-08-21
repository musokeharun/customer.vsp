import { Response, Request } from "express";
import Joi from "joi";
import { validate } from "@shared/validate";
import Customer, { addCustomer } from "../sources/models/Customer";
import {
  checkSmsCode,
  SENDER_NAME,
  usernameOrPasswordIsIncorrect,
} from "@shared/constants";
import { StatusCodes } from "http-status-codes";
import {
  createEmailLink,
  getCodeRandom,
  getSmsCodeString,
} from "@shared/functions";
import { EmailHandler } from "src/sources/implementaions/Email";
import ParseServer from "src/sources/implementaions/ParseServer";
import { CaltonHandler, SmsHandler } from "src/sources/implementaions/Sms";
import logger from "@shared/Logger";
import { addDevice } from "src/sources/models/UserDevice";
import { decrypt } from "@shared/encrypt";
import { JwtService } from "@shared/JwtService";

const { NOT_FOUND, CREATED, FORBIDDEN, OK } = StatusCodes;

let customerQuery = new ParseServer.Query(Customer);
const jwtService = new JwtService();

export const loginPhone = async (req: Request, res: Response) => {
  const { contact, password, email, device } = req.body;

  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().required(),
    contact: Joi.string(),
  }).xor("contact", "email");

  if (!(await validate(schema, { contact, email, password }))) {
    res.json({ msg: "Vsp Id or password is incorrect." }).end();
    return;
  }

  //todo check for user existence
  customerQuery.equalTo("contact", contact);
  const customerFound = await customerQuery.first();
  logger.info(customerFound?.toJSON(), true);
  if (!customerFound) {
    res.status(NOT_FOUND).send({
      err: "Could not authenticate account,User not found.",
    });
    return;
  }

  if (!customerFound.get("isVerified") || !customerFound.get("isActive")) {
    res.status(FORBIDDEN).send({
      err: "Could not authenticate,User not validated.",
    });
    return;
  }

  if (!decrypt(password, customerFound.get("password"))) {
    res.status(FORBIDDEN).send({
      err: "Could not authenticate,Password incorreect.",
    });
    return;
  }

  //todo add devices to used devices
  const { brandName, osName, osVersion, modelName } = device || {};
  let deviceUsed = await addDevice(
    customerFound.get("id"),
    brandName || "N/A",
    modelName || "N/A",
    osName || "N/A",
    osVersion || "N/A"
  );

  let token = new Date().getTime();
  let tokenstring = await jwtService.getJwt({
    contact: customerFound.get("contact"),
    email: customerFound.get("email"),
    deviceId: deviceUsed.id,
    token,
  });

  //todo return devices_id
  res
    .status(OK)
    .json({
      msg: "User authenticated,Log in success.",
      meta: {
        deviceId: deviceUsed.id,
        token: tokenstring,
      },
    })
    .end();

  new Promise(() => {
    customerFound.set("token", token);
    customerFound.save();
  })
    .then(() => {
      logger.info("User Token Set");
    })
    .catch(() => {
      logger.info("User Token Error");
    });
  return;
};

export const registerPhone = async (req: Request, res: Response) => {
  const { contact, password, email } = req.body;

  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .allow("", null),
    password: Joi.string().required(),
    contact: Joi.string().min(10).allow(null, ""),
  }).xor("contact", "email");

  if (!(await validate(schema, { contact, email, password }))) {
    res.status(NOT_FOUND).json({ msg: usernameOrPasswordIsIncorrect }).end();
    return;
  }

  let code = getCodeRandom();

  // todo register customer device
  let customerObject;
  //todo return code in sms || email link
  if (contact) {
    //CHECK EXISTANCE
    // todo check for multiple users
    customerQuery.equalTo("contact", contact);

    customerObject = await customerQuery.first();
    if (!customerObject)
      customerObject = await addCustomer(email, contact, password, code);
    else {
      if (customerObject.get("isVerified")) {
        //TODO App Log Already  Registered
        return res.status(FORBIDDEN).send({
          err: "User already registered",
        });
      } else if (!customerObject.get("isActive")) {
        //TODO App Log User Not Allowed
        return res.status(FORBIDDEN).send({
          err: "User forbidden",
        });
      }
    }

    let smsHandler = new CaltonHandler(
      customerObject.get("contact"),
      getSmsCodeString(customerObject.get("code")),
      SENDER_NAME
    );

    try {
      let result = await sendToPhone(smsHandler);
      console.log("Sent to Phone", result);

      //FIXME
      // TODO
      // if (!result.sent) {  res.status( INTERNAL_SERVER_ERROR ).json({err : "Could not deliver the code to your inbox, try again later."}) }

      res.status(CREATED).json({
        msg: checkSmsCode + contact,
      });
    } catch (err) {
      logger.err(err);

      res.status(NOT_FOUND).json({
        err: "Could not deliver the code to your inbox, try again later",
      });
    }
  } else if (email) {
    customerQuery.equalTo("email", email);
    customerObject = await customerQuery.first();
    if (!customerObject)
      customerObject = await addCustomer(email, contact, password, code);

    let emailLink = createEmailLink(email, customerObject.get("code"));
    res.status(CREATED).json({
      msg: "Check your email for the validation link.",
    });
  } else {
    res
      .status(NOT_FOUND)
      .json({
        err: "Email or contact is required",
      })
      .end();
  }
};

const subscribeFreePackage = () => {};

const sendToPhone = async (smsHandler: SmsHandler) => {
  return await smsHandler.send();
};

const sendToEmail = (emailHandler: EmailHandler) => {
  return emailHandler.send();
};

export const verifyPhone = async (req: Request, res: Response) => {
  const { code, contact } = req.body;

  const schema = Joi.object({
    code: Joi.string().required(),
    contact: Joi.string().required(),
  });

  if (!(await validate(schema, { code, contact }))) {
    res.status(NOT_FOUND).send({
      err: "Could not validate account.",
    });
    return;
  }

  let customerQuery = new ParseServer.Query(Customer);
  customerQuery.equalTo("contact", contact);

  let customerFound = await customerQuery.first();
  if (!customerFound) {
    res
      .status(NOT_FOUND)
      .json({
        err: "Could not validate sush account,No such user found",
      })
      .end();
    return;
  }

  if (customerFound.get("code").toString().trim() !== code.toString().trim()) {
    res
      .status(FORBIDDEN)
      .json({
        err: "Could not validate account,Code is incorrect.",
      })
      .end();
    return;
  }

  if (customerFound.get("isVerified")) {
    res
      .status(FORBIDDEN)
      .json({
        err: "Could not validate account,User is already verified,Please login",
      })
      .end();
    return;
  }

  // todo verify user
  await customerFound.save({
    isVerified: true,
    verfiedAt: new Date(),
  });

  // login && return deviceId
  res
    .status(CREATED)
    .json({
      msg: "Explore VSP Media App and experience the World's Entertainment in one place",
    })
    .end();

  //  TODO SUSCRIBE FREE PACKAGE
  subscribeFreePackage();
};

export const changePassword = (req: Request, res: Response) => {};
