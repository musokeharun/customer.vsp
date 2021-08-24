import { paramMissingError } from "@shared/constants";
import { encrypt } from "@shared/encrypt";
import { validate } from "@shared/validate";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ParseServer from "src/sources/implementaions/ParseServer";
import Admin, { addAdmin } from "src/sources/models/Admin";

const { NOT_FOUND, FORBIDDEN, CREATED } = StatusCodes;
const userQuery = new ParseServer.Query(Admin);

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, isActive } = req.body;

  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    isActive: Joi.number(),
  });

  if (!(await validate(schema, { name, email, password, isActive }))) {
    res
      .status(NOT_FOUND)
      .json({
        err: paramMissingError,
      })
      .end();
    return;
  }

  let image;
  if (req.file) {
    const { fieldname, originalname, mimetype, buffer } = req.file;

    image = new ParseServer.File(
      `${email}.${originalname
        .split(".")
        .pop()
        ?.toString()
        .toLocaleLowerCase()}`,
      { base64: buffer.toString("base64") },
      mimetype
    );
    console.log("Url", image.url());
  }

  userQuery.equalTo("email", email);
  let usersFound = await userQuery.first();
  if (usersFound) {
    res.status(FORBIDDEN).json({
      err: "user already exists",
    });
    return;
  }

  let hashed = encrypt(password);
  let createdAdmin = await addAdmin(name, email, "", !!isActive, hashed, image);
  res.status(CREATED).json({
    msg: "resource created",
    ...createdAdmin.toJSON(),
  });
};

export const updateUser = (req: Request, res: Response) => {};
