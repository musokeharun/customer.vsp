import { Schema } from "joi";
import logger from "@shared/Logger";

export const validate = async (
  schema: Schema,
  value: any
): Promise<boolean> => {
  try {
    await schema.validateAsync(value, { abortEarly: false });
    return true;
  } catch (e) {
    logger.info(e);
    return false;
  }
};
