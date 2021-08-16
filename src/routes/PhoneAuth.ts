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

const { NOT_FOUND, CREATED, FORBIDDEN } = StatusCodes;

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
    res.json({ msg: "Email or password is incorrect." }).end();
    return;
  }

  //todo check for user existence
  const customer_Object = new Customer();

  //todo add devices to used devices

  //todo return devices_id
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
  let customerQuery = new ParseServer.Query(Customer);

  //todo return code in sms || email link
  if (contact) {
    //CHECK EXISTANCE
    // todo check for multiple users
    customerQuery.equalTo("contact", contact);

    customerObject = await customerQuery.first();
    if (!customerObject)
      customerObject = await addCustomer(email, contact, password, code);

    let smsHandler = new CaltonHandler(
      customerObject.get("contact"),
      getSmsCodeString(customerObject.get("code")),
      SENDER_NAME
    );

    let { data: result } = await sendToPhone(smsHandler);
    console.log("Sent to Phone", result);

    res.status(CREATED).json({
      msg: checkSmsCode + contact,
    });
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

const sendToPhone = (smsHandler: SmsHandler) => {
  return smsHandler.send();
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
    res.send();
  }

  let customerQuery = new ParseServer.Query(Customer);
  customerQuery.equalTo("contact", contact);
  customerQuery.equalTo("code", code);

  let customerFound = await customerQuery.first();
  if (!customerFound) {
    res
      .status(NOT_FOUND)
      .json({
        err: "No such user found",
      })
      .end();
    return;
  }

  if (customerFound.get("isVerified")) {
    res
      .status(FORBIDDEN)
      .json({
        err: "User is already verified,Please login",
      })
      .end();
    return;
  }

  // todo verify user
  let verifiedUser = await customerFound.save({
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
};

export const changePassword = (req: Request, res: Response) => {};
