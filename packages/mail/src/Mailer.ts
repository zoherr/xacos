export interface MailMessage {
  from?: string;
  to: string | string[];
  subject: string;
  template?: string;
  data?: Record<string, any>;
  text?: string;
  html?: string;
}

export interface MailResult {
  success: boolean;
  messageId?: string | undefined;
  error?: string | undefined;
  provider: string;
}


export abstract class Mailer {
  abstract send(message: MailMessage): Promise<MailResult>;
}

