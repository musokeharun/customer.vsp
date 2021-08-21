import bcrypt from "bcrypt";
import { pwdSaltRounds } from "@shared/constants";

const salt = bcrypt.genSaltSync(pwdSaltRounds);

export const encrypt = (value: string) => {
  return bcrypt.hashSync(value, salt);
};

export const decrypt = (value: string, hash: string) =>
  bcrypt.compareSync(value, hash);
