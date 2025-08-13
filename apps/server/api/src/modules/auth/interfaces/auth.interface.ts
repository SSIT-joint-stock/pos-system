import {
  IManualRegister,
  IOAuthRegister,
} from "@modules/auth/interfaces/register";
import { IManualLogin, IOAuthLogin } from "./login";

export type AuthType = "MANUAL" | "OAUTH";

export interface IAuthService {
  //   reister(data: T): Promise<TResult>;
  register(
    type: AuthType,
    data: IManualRegister | IOAuthRegister
  ): Promise<any>;

  // Đăng nhập
  register(type: AuthType, data: IManualLogin | IOAuthLogin): Promise<any>;
}
