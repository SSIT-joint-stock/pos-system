import nodemailer, { Transporter } from 'nodemailer';
// const hbs = await import('nodemailer-express-handlebars');
import SMTPTransport from 'nodemailer-smtp-transport';
import { marked } from 'marked';
import { EmailConfig, EmailOptions, EmailResponse } from './types';
import { createEmailConfig } from './config';
import { LoggerInstance, createLogger } from '@repo/logger';

export * from './types';
export * from './config';
export * from './queue';

export class EmailService {
  private transporter: Transporter | undefined;
  private config: EmailConfig;
  private logger: LoggerInstance;

  constructor(config: Partial<EmailConfig> = {}) {
    this.config = createEmailConfig(config);
    this.logger = createLogger({ 
      serviceName: 'EmailService',
      enableConsole: true,
      enableLoki: true,
    });
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport(
      SMTPTransport({
        service: this.config.service,
        auth: {
          user: this.config.user,
          pass: this.config.password,
        },
      })
    );

    // if (this.config.templatePath) {
    //   this.transporter.use(
    //     'compile',
    //     hbs({
    //       viewEngine: {
    //         extname: '.hbs',
    //         layoutsDir: this.config.templatePath,
    //         defaultLayout: false,
    //         partialsDir: this.config.templatePath,
    //       },
    //       viewPath: this.config.templatePath,
    //       extName: '.hbs',
    //     })
    //   );
    // }
  }

  private async convertMarkdownToHtml(markdown: string): Promise<string> {
    return marked(markdown);
  }

  public async sendMail(options: EmailOptions): Promise<EmailResponse> {
    try {
      const mailOptions = {
        from: options.from || this.config.defaultFrom,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        attachments: options.attachments,
      } as any;

      if (options.template) {
        mailOptions.template = options.template;
        mailOptions.context = options.context || {};
      } else if (options.text) {
        const html = await this.convertMarkdownToHtml(options.text);
        mailOptions.text = options.text;
        mailOptions.html = html;
      } else if (options.html) {
        mailOptions.html = options.html;
      }

      const info = await this.transporter?.sendMail(mailOptions);
      
      this.logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      this.logger.error('Failed to send email', {
        error,
        to: options.to,
        subject: options.subject,
      });

      return {
        success: false,
        error: error as Error,
      };
    }
  }

  public async sendNotification(subject: string, text: string): Promise<EmailResponse> {
    return this.sendMail({
      to: this.config.notificationEmail,
      subject: `[NOTIFICATION] ${subject}`,
      text,
    });
  }

  public async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter?.verify();
      return true;
    } catch (error) {
      this.logger.error('Failed to verify email connection', { error });
      return false;
    }
  }
}
