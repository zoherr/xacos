import type { Mailer, MailMessage, MailResult } from '../Mailer';
import { interpolate } from '../utils/interpolate';

export class LogMailer implements Mailer {
  constructor(private from: string = 'noreply@xacos.dev') {
  }

  async send(message: MailMessage): Promise<MailResult> {
    const subject = interpolate(message.subject, message.data ?? {});
    const text = message.text ? interpolate(message.text, message.data ?? {}) : undefined;
    const html = message.template 
      ? interpolate(message.template, message.data ?? {}) 
      : (message.html ? interpolate(message.html, message.data ?? {}) : undefined);

    console.log('\n--- [MAIL LOG] ---');
    console.log('From:   ', message.from ?? this.from);
    console.log('To:     ', message.to);
    console.log('Subject:', subject);
    if (text) console.log('Text:   ', text);
    if (html) console.log('HTML:   ', '[Rendered HTML Content]');
    console.log('------------------\n');

    return {
      success: true,
      provider: 'log',
    };
  }
}

