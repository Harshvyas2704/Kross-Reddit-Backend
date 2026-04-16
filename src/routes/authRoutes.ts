import { Router } from "express";
import { login, refresh, register } from "../controller/authController";

const router = Router();

router.post("/register", register); // Sirf test user banane ke liye
router.post("/login", login); // Tere RN App ke liye
router.post("/refresh", refresh); // Tere RN Interceptor ke liye

export default router;
