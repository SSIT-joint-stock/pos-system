import nodemailer, { Transporter } from 'nodemailer';
// const hbs = await import('nodemailer-express-handlebars');
import SMTPTransport from 'nodemailer-smtp-transport';
import { marked } from 'marked';
import { EmailConfig, EmailOptions, EmailResponse } from './types';
import { createEmailConfig } from './config';
import Mail from 'nodemailer/lib/mailer';

export * from './types';
export * from './config';
export * from './queue';

export class EmailService {
  private transporter: Transporter | undefined;
  private config: EmailConfig;

  constructor(config: Partial<EmailConfig> = {}) {
    this.config = createEmailConfig(config);
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
      const mailOptions: Mail.Options = {
        from: options.from || this.config.defaultFrom,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        attachments: options.attachments,
      };

      if (options.text) {
        const html = await this.convertMarkdownToHtml(options.text);
        mailOptions.text = options.text;
        mailOptions.html = html;
      } else if (options.html) {
        mailOptions.html = options.html;
      }

      const info = await this.transporter?.sendMail(mailOptions);

      return {
        success: true,
        messageId: info?.messageId,
      };

    } catch (error) {
      console.error('Failed to send email', error);
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
      console.error('Failed to verify email connection', error);
      return false;
    }
  }
}
