import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request } from "@hapi/hapi";
import { db } from "./db.js";


dotenv.config();

export function createToken(user: { _id: string; email: string }) {
  const payload = {
    id: user._id,
    email: user.email,
  };
  const options: jwt.SignOptions = {
    algorithm: "HS256",
    expiresIn: "1h",
  };
  return jwt.sign(payload, process.env.COOKIE_PASSWORD as string, options);
}

export function decodeToken(token: string) {
  const userInfo: { userId?: string; email?: string } = {};
  try {
    const decoded = jwt.verify(token, process.env.COOKIE_PASSWORD as string) as jwt.JwtPayload;
    if (decoded) {
      userInfo.userId = decoded.id;
      userInfo.email = decoded.email;
    }
  } catch (e: any) {
    console.log(e.message);
  }
  return userInfo;
}

export async function validate(decoded: { id: string }, request: Request) {
  if (!db.userStore) {
    return { isValid: false };
  }
  const user = await db.userStore.getUserById(decoded.id);
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: user };
}
