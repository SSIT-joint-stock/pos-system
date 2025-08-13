import { ILoginBase } from "@modules/auth/interfaces/login";

export interface ILoginStrategy<T extends ILoginBase, TResult = any> {
  findUser(data: T): Promise<TResult>;
}
