import { Router } from "express";
import { uploadMw } from "src/routes/middleware";
import { createUser } from "./users";

const admin = Router();

admin.post("/signup", uploadMw.single("image"), createUser);

export default admin;
