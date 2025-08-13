export interface ILoginBase {
  email: string;
  username: string;
  lastName?: string;
  firstName?: string;
  avatar?: string;
  type: "MANUAL" | "OAUTH";
}

export interface IManualLogin extends ILoginBase {
  passwordHash: string;
  type: "MANUAL";
}

export interface IOAuthLogin extends ILoginBase {
  googleId: string;
  type: "OAUTH";
}
