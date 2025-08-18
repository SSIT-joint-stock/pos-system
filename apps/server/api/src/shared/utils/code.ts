export class CreateCodeUtils {
  private static readonly OTP_MIN = 100000;
  private static readonly OTP_RANGE = 900000;
  private static readonly EXPIRY_MINUTES = 5;
  private static readonly EXPIRY_MS =
    CreateCodeUtils.EXPIRY_MINUTES * 60 * 1000;

  constructor(private readonly saltRounds: number = 10) {}

  createCode(): string {
    return Math.floor(
      CreateCodeUtils.OTP_MIN + Math.random() * CreateCodeUtils.OTP_RANGE
    ).toString();
  }

  setCodeExpiry(): Date {
    return new Date(Date.now() + CreateCodeUtils.EXPIRY_MS);
  }

  setResetToken(): string {
    return Math.floor(
      CreateCodeUtils.OTP_MIN + Math.random() * CreateCodeUtils.OTP_RANGE
    ).toString();
  }
}
