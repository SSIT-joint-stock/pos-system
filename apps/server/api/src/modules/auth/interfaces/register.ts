export interface IRegisterBase {
  email: string;
  username: string;
  lastName?: string;
  firstName?: string;
  avatar?: string;
  type: "MANUAL" | "OAUTH";
}

export interface IManualRegister extends IRegisterBase {
  password: string;
  type: "MANUAL";
}

export interface IOAuthRegister extends IRegisterBase {
  googleId: string;
  type: "OAUTH";
}
