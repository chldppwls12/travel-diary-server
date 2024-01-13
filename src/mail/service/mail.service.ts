import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  private transporter = createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: this.configService.get<string>('GMAIL_USER'),
      clientId: this.configService.get<string>('GMAIL_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GMAIL_CLIENT_SECERT'),
      refreshToken: this.configService.get<string>('GMAIL_REFRESH_TOKEN'),
    },
  });

  async sendCode(email: string): Promise<number> {
    try {
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      const mailOptions = {
        to: email,
        subject: '[Traily] 인증번호 안내 메일',
        html: `인증번호 : ${randomCode}</a>`,
      };

      await this.transporter.sendMail(mailOptions);

      return randomCode;
    } catch (err: any) {
      console.error(err);
    }
  }

  async sendResetPassword(email: string, password: string): Promise<void> {
    try {
      const mailOptions = {
        to: email,
        subject: '[Traily] 비밀번호 재설정 안내 메일',
        html: `새로운 비밀번호: ${password}</a>`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (err: any) {
      console.error(err);
    }
  }
}
