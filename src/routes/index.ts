import { Router } from "express";
import { authMw } from "./middleware";
import { login, logout } from "./Auth";
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from "./Users";
import { connectSocketRm, emitMessage } from "./Chat";
import { logDevice } from "./SplashScreen";
import { loginPhone, registerPhone, verifyPhone } from "./PhoneAuth";

// Auth router
const authRouter = Router();
authRouter.post("/login", login);
authRouter.get("/logout", logout);

// User router
const userRouter = Router();
userRouter.get("/all", getAllUsers);
userRouter.post("/add", addOneUser);
userRouter.put("/update", updateOneUser);
userRouter.delete("/delete/:id", deleteOneUser);

// Chat router
const chatRouter = Router();
chatRouter.get("/connect-socket-room/:socketId", connectSocketRm);
chatRouter.post("/emit-message", emitMessage);

// SplashScreen Router
const splashRouter = Router();
splashRouter.post("/open/log", logDevice);

//CUSTOMER AUTH
const phoneAuthRouter = Router();
phoneAuthRouter.use("/login", loginPhone);
phoneAuthRouter.use("/register", registerPhone);
phoneAuthRouter.use("/verify", verifyPhone);

// Base router (serves all others)
const baseRouter = Router();
baseRouter.use("/auth", phoneAuthRouter);
baseRouter.use("/users", authMw, userRouter);
baseRouter.use("/chat", authMw, chatRouter);

//APP DATA
baseRouter.use("/splash", splashRouter);

export default baseRouter;
