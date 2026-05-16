import type { XacosConfig } from '@xacos/config';
import type { Mailer, MailMessage, MailResult } from './Mailer';
import { LogMailer } from './drivers/LogMailer';
import { SmtpMailer } from './drivers/SmtpMailer';
import { SesMailer } from './drivers/SesMailer';
import { MailgunMailer } from './drivers/MailgunMailer';
import { PostmarkMailer } from './drivers/PostmarkMailer';
import { ResendMailer } from './drivers/ResendMailer';


export class MailManager {
  private mailer: Mailer | null = null;

  constructor(private config: XacosConfig['mail'] = {}) {}

  getMailer(): Mailer {
    if (this.mailer) return this.mailer;

    const config = this.config ?? {};
    const driver = config.driver ?? 'log';

    switch (driver) {
      case 'smtp':
        this.mailer = new SmtpMailer({
          host: config.host ?? 'localhost',
          port: config.port ?? 587,
          user: config.user ?? '',
          pass: config.pass ?? '',
          from: config.from ?? 'noreply@xacos.dev',
        });
        break;
      case 'ses':
        if (!config.ses) throw new Error('[XAOCS Mail] SES config missing');
        this.mailer = new SesMailer({
          region: config.ses.region ?? 'us-east-1',
          key: config.ses.key ?? '',
          secret: config.ses.secret ?? '',
          from: config.from ?? 'noreply@xacos.dev',
        });
        break;
      case 'mailgun':
        this.mailer = new MailgunMailer({
          apiKey: process.env['MAILGUN_API_KEY'] ?? '',
          domain: process.env['MAILGUN_DOMAIN'] ?? '',
          from: config.from ?? 'noreply@xacos.dev',
          host: process.env['MAILGUN_HOST'] ?? undefined,
        });
        break;

      case 'postmark':
        this.mailer = new PostmarkMailer({
          serverToken: process.env['POSTMARK_SERVER_TOKEN'] ?? '',
          from: config.from ?? 'noreply@xacos.dev',
        });
        break;
      case 'resend':
        this.mailer = new ResendMailer({
          apiKey: process.env['RESEND_API_KEY'] ?? '',
          from: config.from ?? 'noreply@xacos.dev',
        });
        break;

      case 'log':
      default:
        this.mailer = new LogMailer(config.from);
        break;
    }

    return this.mailer;
  }

  async send(message: MailMessage): Promise<MailResult> {
    return this.getMailer().send(message);
  }
}

