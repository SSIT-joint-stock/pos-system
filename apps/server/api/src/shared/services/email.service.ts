import config from "@shared/config/app.config";
import { createContextLogger } from "@shared/utils/logger";
import { EmailQueueService, EmailQueueServiceConfig } from "@repo/email";
import { type EmailOptions } from "@repo/dto";

export const logger = createContextLogger("RedisService");

export class EmailServiceSingleton {
  private static instance: EmailServiceSingleton | null = null;
  private client!: EmailQueueService;

  private constructor() { }

  public static getInstance(): EmailServiceSingleton {
    if (!EmailServiceSingleton.instance) {
      EmailServiceSingleton.instance = new EmailServiceSingleton();
      EmailServiceSingleton.instance.initialize();
    }
    return EmailServiceSingleton.instance;
  }

  private initialize(options?: EmailQueueServiceConfig): void {
    const initializedOptions: EmailQueueServiceConfig = {
      service: config.EMAIL_SERVICE || "gmail",
      user: config.EMAIL_USER || "userEmail",
      password: config.EMAIL_PASSWORD || "password",
      notificationEmail: config.EMAIL_NOTI || "",
      defaultFrom: config.EMAIL_USER || "",
      // templatePath: config.EMAIL_TEMPLATE_PATH || "",
      redis: {
        host: config.REDIS_HOST || "localhost",
        port: config.REDIS_PORT || 6379,
        password: config.REDIS_PASSWORD || undefined,
      },
      logLevel: "debug",
      ...options,
    };

    console.log("env", config);

    // this.client = new Redis(initializedOptions);
    this.client = new EmailQueueService(initializedOptions);
  }

  public async connect(): Promise<void> {
    // if (!this.client.status || this.client.status === "end") {
    //   this.initialize();
    // }
    // if (this.client.status !== "ready" && this.client.status !== "connecting") {
    //   await this.client.connect();
    // }
  }

  public getClient(): EmailQueueService {
    return this.client;
  }

  public async sendEmail(
    htmlBody: string,
    options: EmailOptions, // DTO EmailOptions from @repo/dto
    textBody?: string
  ) {
    return await this.client.sendEmail(htmlBody, options, textBody);
  }

  public async getEmailStatus(jobId: string) {
    return await this.client.getEmailStatus(jobId);
  }
}

export const EmailService = EmailServiceSingleton.getInstance();
export default EmailService;