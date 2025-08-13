// auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { JwtPayload, verifyAccessToken } from "@shared/utils/jwt.utils";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // @ts-ignore - cookies có thể chưa khai báo type nếu chưa add cookie-parser
  const token = req.cookies?.accessToken as string | undefined;

  if (!token) {
    return res.status(401).json({
      error: "unauthorized",
      message: "Access token is missing",
    });
  }

  try {
    const payload = verifyAccessToken(token);

    // gắn payload vào req để downstream dùng
    (req as Request & { user?: { id: string } & JwtPayload }).user = {
      id: payload.userId,
      ...payload,
    };

    return next();
  } catch (err: any) {
    return res.status(401).json({
      error:
        err?.name === "TokenExpiredError" ? "token_expired" : "invalid_token",
      message:
        err?.name === "TokenExpiredError"
          ? "Access token has expired"
          : "Access token is invalid",
    });
  }
}
