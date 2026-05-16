import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import type { Mailer, MailMessage, MailResult } from '../Mailer';
import { interpolate } from '../utils/interpolate';

export interface MailgunConfig {
  apiKey: string;
  domain: string;
  from: string;
  host?: string | undefined; // default: 'api.mailgun.net', use 'api.eu.mailgun.net' for EU
}

export class MailgunMailer implements Mailer {
  private client: ReturnType<InstanceType<typeof Mailgun>['client']>;
  private config: MailgunConfig;

  constructor(config: MailgunConfig) {
    this.config = config;
    const mg = new Mailgun(FormData);
    this.client = mg.client({
      username: 'api',
      key: config.apiKey,
      url: config.host ?? 'https://api.mailgun.net',
    });
  }

  async send(message: MailMessage): Promise<MailResult> {
    const html = message.template
      ? interpolate(message.template, message.data ?? {})
      : message.html ?? '';

    try {
      const response = await this.client.messages.create(this.config.domain, {
        from: message.from ?? this.config.from,
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        html,
        text: message.text,
      } as any);


      return {
        success: true,
        messageId: response.id,
        provider: 'mailgun',
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: 'mailgun',
      };
    }
  }
}

