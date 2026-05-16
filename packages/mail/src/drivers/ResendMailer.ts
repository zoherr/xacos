import { Resend } from 'resend';
import type { Mailer, MailMessage, MailResult } from '../Mailer';
import { interpolate } from '../utils/interpolate';

export interface ResendConfig {
  apiKey: string;
  from: string;
}

export class ResendMailer implements Mailer {
  private client: Resend;
  private config: ResendConfig;

  constructor(config: ResendConfig) {
    this.config = config;
    this.client = new Resend(config.apiKey);
  }

  async send(message: MailMessage): Promise<MailResult> {
    const html = message.template
      ? interpolate(message.template, message.data ?? {})
      : message.html ?? '';

    try {
      const response = await this.client.emails.send({
        from: message.from ?? this.config.from,
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        html,
        text: message.text,
      } as any);


      if (response.error) {
        return {
          success: false,
          error: response.error.message,
          provider: 'resend',
        };
      }

      return {
        success: true,
        messageId: response.data?.id,
        provider: 'resend',
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: 'resend',
      };
    }
  }
}

