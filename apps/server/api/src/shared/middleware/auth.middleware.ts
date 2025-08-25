import { JwtUtils } from "./../utils/jwt";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { RegisterWithAuth } from "../types/request";
import { UserRepository } from "../repositories/user.repository";

export const jwtAccessUtils = new JwtUtils<any>(
  process.env.JWT_ACCESS_SECRET!,
  process.env.JWT_ACCESS_EXPIRY!
);

export const jwtRefreshUtils = new JwtUtils<any>(
  process.env.JWT_REFRESH_SECRET!,
  process.env.JWT_REFRESH_EXPIRY!
);

export class AuthMiddleware {
  private useRepo = new UserRepository();
  verifyAccessToken() {
    return async (req: RegisterWithAuth, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ message: "No access token provided" });
        }

        const token = authHeader.split(" ")[1];
        const payload = jwtAccessUtils.verifyToken(token); // ✅ dùng access secret
        console.log(payload);
        req.userId = (payload as any).sub;
        const isActive = await this.useRepo.isActive(req.userId);
        if (!isActive) {
          return res.status(403).json({ message: "User not active" });
        }
        next();
      } catch (err) {
        return res.status(401).json({ message: "Invalid or Expired Token" });
      }
    };
  }

  verifyRefreshToken() {
    return (req: RegisterWithAuth, res: Response, next: NextFunction) => {
      try {
        const token = req.cookies?.refreshToken;
        if (!token) {
          return res.status(401).json({ message: "No refresh token provided" });
        }

        const payload = jwtRefreshUtils.verifyToken(token);
        req.userId = (payload as any).sub;
        next();
      } catch (err) {
        return res
          .status(401)
          .json({ message: "Invalid or expired refresh token" });
      }
    };
  }
}
