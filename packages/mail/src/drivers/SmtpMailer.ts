import nodemailer from 'nodemailer';
import type { Mailer, MailMessage, MailResult } from '../Mailer';
import { interpolate } from '../utils/interpolate';

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export class SmtpMailer implements Mailer {
  private transporter: nodemailer.Transporter;
  private defaultFrom: string;

  constructor(config: SmtpConfig) {
    this.defaultFrom = config.from;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  async send(message: MailMessage): Promise<MailResult> {
    const subject = interpolate(message.subject, message.data ?? {});
    const text = message.text ? interpolate(message.text, message.data ?? {}) : undefined;
    const html = message.template 
      ? interpolate(message.template, message.data ?? {}) 
      : (message.html ? interpolate(message.html, message.data ?? {}) : undefined);

    try {
      const response = await this.transporter.sendMail({
        from: message.from ?? this.defaultFrom,
        to: Array.isArray(message.to) ? message.to.join(', ') : message.to,
        subject,
        text,
        html,
      });

      return {
        success: true,
        messageId: response.messageId,
        provider: 'smtp',
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: 'smtp',
      };
    }
  }
}

