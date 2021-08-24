import { validate } from "@shared/validate";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ParseServer from "src/sources/implementaions/ParseServer";
import Category, { addCategory } from "src/sources/models/Category";

const { BAD_REQUEST, FORBIDDEN, NOT_FOUND } = StatusCodes;

const categoryQuery = new ParseServer.Query(Category);

export const addCategoryRes = async (req: Request, res: Response) => {
  const { name, desc, image, isActive } = req.body;

  const schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
    isActive: Joi.boolean(),
  });

  if (!(await validate(schema, { name, desc, isActive }))) {
    res.status(BAD_REQUEST).json({
      err: "User not found.",
    });
    return;
  }

  categoryQuery.equalTo("name", name);
  let categoryQueryFound = categoryQuery.first();

  if (await categoryQueryFound) {
    res.status(FORBIDDEN).json({
      err: "Category already found.",
    });
    return;
  }

  let categoryQueryCreated = await addCategory(
    name,
    desc,
    "",
    !!parseInt(isActive),
    null
  );

  res.json({ msg: categoryQueryCreated.id, ...categoryQueryCreated.toJSON() });
};

export const getCategory = (req: Request, res: Response) => {
  const { id, all } = req.query;

  if (!id) {
    if (!all) categoryQuery.equalTo("isActive", true);
    let categories = categoryQuery.findAll();
    res.json(categories).end();
    return;
  }

  let categoryFound = categoryQuery.get((id || "").toString());
  if (!categoryFound) {
    res.status(NOT_FOUND).json({
      err: "resource not found",
    });
  }
  return res.json(categoryFound);
};
