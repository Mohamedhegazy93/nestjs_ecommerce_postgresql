import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable({})
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
// Send Verify Code After Register
  public async sendRegisterEmail(email: string, emailVerfiyCode: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `from nestjs_project`,
        subject: `verifiycode for your account:${emailVerfiyCode} `,
      });
    } catch (error) {
      console.log(error);
    }
  }
  // Send Verify Code For Reset Password
  public async sendResetPasswordCode(email: string, passwordResetCode: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `from nestjs_project`,
        subject: `reset code for password:${passwordResetCode} `,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
