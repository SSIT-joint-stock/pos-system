
import { IRegisterStrategy } from "./IRegisterStrategy";
import { IOAuthRegister } from "../interfaces/register";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;
export class OAuthRegisterStategy implements IRegisterStrategy<IOAuthRegister, any>{
    async createUser(data: IOAuthRegister): Promise<any> {
        
    }
}