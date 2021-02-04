import { RoomDocument } from './../rooms/entities/room.entity';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

interface IPasswordRecoverMail {
  url: string;
  email: string;
  username: string;
  ttl: number;
}

interface INotifyAdmin {
  email: string;
  room: RoomDocument;
}

@Injectable()
export class MailService {
  private static readonly logger = new Logger('MailService');
  constructor(private readonly mailerService: MailerService) {}

  public async sendRecoverPasswordEmail({
    email,
    username,
    url,
    ttl,
  }: IPasswordRecoverMail) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Recover password | Break Barriers',
        template: 'mailValidation',
        context: {
          username,
          url,
          ttl,
        },
      });
      return true;
    } catch (error) {
      MailService.logger.error(error.message);
      return false;
    }
  }

  public async sendNotifyAdminMail({ email, room }: INotifyAdmin) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Join request (${room.waitlist.length}new) | ${room.title}`,
        template: 'notifyAdmin',
        context: {
          room,
        },
      });
      return true;
    } catch (error) {
      MailService.logger.error(error.message);
      return false;
    }
  }

  public async sendMail(sendMailOptions: Partial<ISendMailOptions>) {
    return await this.mailerService.sendMail(sendMailOptions);
  }
}
