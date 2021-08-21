// Strings
export const paramMissingError =
  "One or more of the required parameters was missing.";
export const loginFailedErr = "Login failed";

// Numbers
export const pwdSaltRounds = 12;

// Cookie Properties
export const cookieProps = Object.freeze({
  key: "ExpressGeneratorTs",
  secret: process.env.COOKIE_SECRET,
  options: {
    httpOnly: true,
    signed: true,
    path: process.env.COOKIE_PATH,
    maxAge: Number(process.env.COOKIE_EXP),
    domain: process.env.COOKIE_DOMAIN,
    secure: process.env.SECURE_COOKIE === "true",
  },
});

export const welcomeMessage = "Welcome to VSP";

export const SENDER_NAME = "VSP Media";

export const usernameOrPasswordIsIncorrect = "VSP Id or password is incorrect.";

export const checkSmsCode = "Code has been sent to your inbox @ ";
