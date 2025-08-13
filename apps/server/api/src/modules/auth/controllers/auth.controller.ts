// auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "@modules/auth/services/auth.service";

export class AuthController {
  async register(req: Request, res: Response) {
    const { type, ...data } = req.body;
    console.log(req.body);
    console.log(type);
    try {
      const authService = new AuthService();
      const result = await authService.register(type, data);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: (error as Error).message });
    }
  }

  // async login(req: Request, res: Response) {
  //   const { type, ...data } = req.body;

  //   try {
  //     const authService = new AuthService();

  //     const result = await authService.login(type, data);
  //     res.cookie("accessToken", result.accessToken, {
  //       httpOnly: true, // ngăn JS phía client đọc token
  //       secure: process.env.NODE_ENV === "production", // chỉ gửi qua HTTPS khi production
  //       maxAge: Number(process.env.JWT_ACCESS_EXPIRY),
  //       sameSite: "strict",
  //     });

  //     res.cookie("refreshToken", result.refreshToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       maxAge: Number(process.env.JWT_REFRESH_EXPIRY),
  //       sameSite: "strict",
  //     });
  //     res.status(200).json({ success: true, data: result });
  //   } catch (error) {
  //     res
  //       .status(400)
  //       .json({ success: false, message: (error as Error).message });
  //   }
  // }
}
