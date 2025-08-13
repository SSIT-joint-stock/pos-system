import { IRegisterBase } from "@modules/auth/interfaces/register";

export interface IRegisterStrategy<T extends IRegisterBase, TResult = any> {
  createUser(data: T): Promise<TResult>;
}
