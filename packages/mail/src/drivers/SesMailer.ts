import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { Mailer, MailMessage, MailResult } from '../Mailer';
import { interpolate } from '../utils/interpolate';

export interface SesConfig {
  region: string;
  key: string;
  secret: string;
  from: string;
}

export class SesMailer implements Mailer {
  private client: SESClient;
  private defaultFrom: string;

  constructor(config: SesConfig) {
    this.defaultFrom = config.from;
    this.client = new SESClient({
      region: config.region,
      credentials: {
        accessKeyId: config.key,
        secretAccessKey: config.secret,
      },
    });
  }

  async send(message: MailMessage): Promise<MailResult> {
    const subject = interpolate(message.subject, message.data ?? {});
    const text = message.text ? interpolate(message.text, message.data ?? {}) : undefined;
    const html = message.template 
      ? interpolate(message.template, message.data ?? {}) 
      : (message.html ? interpolate(message.html, message.data ?? {}) : undefined);

    const command = new SendEmailCommand({
      Source: message.from ?? this.defaultFrom,
      Destination: {
        ToAddresses: Array.isArray(message.to) ? message.to : [message.to],
      },
      Message: {
        Subject: { Data: subject },
        Body: {
          Text: text ? { Data: text } : undefined,
          Html: html ? { Data: html } : undefined,
        },
      },
    });

    try {
      const response = await this.client.send(command);
      return {
        success: true,
        messageId: response.MessageId,
        provider: 'ses',
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: 'ses',
      };
    }
  }
}

