import bcrypt from "bcryptjs";
import { ILoginStrategy } from "@modules/auth/strategies/ILoginStrategy";
import { ILoginBase } from "@modules/auth/interfaces/login";
import prisma from "@shared/orm/prisma";
import { IManualLogin } from "@modules/auth/interfaces/login";
import { signAccessToken, signRefreshToken } from "@/shared/utils/jwt.utils";

export class ManualLoginStrategy implements ILoginStrategy<ILoginBase, any> {
  async findUser(data: IManualLogin): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        throw new Error("Incorrect username or password");
      }
      if (!user.passwordHash) {
        throw new Error("Password must not be empty");
      }
      const isMatch = bcrypt.compareSync(data.passwordHash, user.passwordHash);
      if (!isMatch) {
        throw new Error("Incorrect username or password");
      }

      const accessToken = signAccessToken({
        userId: user.id,
        email: user.email,
      });

      const refreshToken = signRefreshToken({
        userId: user.id,
        email: user.email,
      });

      const { passwordHash, ...userWithoutPass } = user;
      return {
        user: userWithoutPass,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }
}
