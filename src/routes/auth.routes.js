import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const authrouter = Router();

// POST /api/auth/register

authrouter.post("/register", authController.register);


export default authrouter;