import { Request, Response } from "express";
import * as jwtWeb from "jsonwebtoken";
import { User } from "../models/User";
import { log } from "console";

const generateTokens = (userId: string) => {
  const accessToken = jwtWeb.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: "15m" },
  );
  const refreshToken = jwtWeb.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" },
  );
  return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // 2. Check Password
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // 3. Generate Tokens
    const tokens = generateTokens(user.id);

    res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name },
      ...tokens,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

export const refresh = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(401).json({ message: "Refresh token required" });

    // Verify Refresh Token
    const decoded: any = jwtWeb.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string,
    );

    // Issue New Access Token
    const newAccessToken = jwtWeb.sign(
      { id: decoded.id },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "15m" },
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// Temp function for you to create a test user
export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, name } = req.body;
    console.log(req.body);

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ email, passwordHash: password, name });
    res
      .status(201)
      .json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error during registration" });
  }
};
