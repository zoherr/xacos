import { ServerClient } from 'postmark';
import type { Mailer, MailMessage, MailResult } from '../Mailer';
import { interpolate } from '../utils/interpolate';

export interface PostmarkConfig {
  serverToken: string;
  from: string;
}

export class PostmarkMailer implements Mailer {
  private client: ServerClient;
  private config: PostmarkConfig;

  constructor(config: PostmarkConfig) {
    this.config = config;
    this.client = new ServerClient(config.serverToken);
  }

  async send(message: MailMessage): Promise<MailResult> {
    const htmlBody = message.template
      ? interpolate(message.template, message.data ?? {})
      : message.html ?? '';

    try {
      const messageData: any = {
        From: message.from ?? this.config.from,
        To: Array.isArray(message.to) ? message.to.join(',') : message.to,
        Subject: message.subject,
        MessageStream: 'outbound',
      };

      if (htmlBody) messageData.HtmlBody = htmlBody;
      if (message.text) messageData.TextBody = message.text;

      const response = await this.client.sendEmail(messageData);



      return {
        success: true,
        messageId: response.MessageID,
        provider: 'postmark',
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: 'postmark',
      };
    }
  }
}

