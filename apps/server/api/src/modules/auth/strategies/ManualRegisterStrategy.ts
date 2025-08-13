import prisma from "@shared/orm/prisma";
import {
  IManualRegister,
  IOAuthRegister,
} from "@modules/auth/interfaces/register";
import { IRegisterStrategy } from "@modules/auth/strategies/IRegisterStrategy";
import bcrypt from "bcryptjs";
import { error } from "console";
// import { da } from "zod/v4/locales/index.cjs";

export class ManualRegisterStrategy
  implements IRegisterStrategy<IManualRegister, any>
{
  async createUser(data: IManualRegister): Promise<any> {
    console.log("Creating manual user:", data);
    // console.log("----------------", data.username);
    const passwordHashed = await bcrypt.hash(data.password, 10);
    try {
      const existUser = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });
      if (existUser) {
        throw new Error("User already exists");
      }
      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          passwordHash: passwordHashed,
          createdAt: new Date(),
        },
        select: {
          username: true,
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      console.error("Error creating manual user:", error);
      throw error;
    }
  }
}
