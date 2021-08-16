import { JwtService } from "./JwtService";
import logger from "./Logger";

// Print an error if the error message in truthy
export const pErr = (err: Error) => {
  if (err) {
    logger.err(err);
  }
};

// Get a random number between 1 and 1,000,000,000,000
export const getRandomInt = () => {
  return Math.floor(Math.random() * 1_000_000_000_000);
};

export const getCodeRandom = (length: number = 5) => {
  const power = Math.pow(10, length);
  return Math.round(Math.random() * power);
};

export const getSmsCodeString = (code: string | number) =>
  `Your VSP Code to confirm your registeration is ${code}.`;

export const createEmailLink = (email: string, code: string | number) => {
  return "";
};
