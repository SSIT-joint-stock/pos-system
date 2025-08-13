import jwt, {  SignOptions } from "jsonwebtoken";


const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "1d";
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

export interface JwtPayload {
  userId: string;
  email: string;
}

export const signAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_ACCESS_SECRET as string, {
    expiresIn: JWT_ACCESS_EXPIRY as SignOptions["expiresIn"],
  });
};

export const signRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET as string, {
    expiresIn: JWT_REFRESH_EXPIRY as SignOptions["expiresIn"],
  });
};
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
};
