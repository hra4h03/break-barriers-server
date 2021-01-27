import { UpdateUserPasswordDto } from './../users/dto/update-user-password.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { UnauthorizeExceptionFilter } from './../exeption-filters/unauthorize-exeption.filter';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserDocument } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { MailService } from 'src/mail/mail.service';
import { UpdateUserWithEmail } from 'src/users/dto/update-with-email.dto';
import { UsersService } from 'src/users/users.service';

const isProd = process.env.NODE_ENV === 'production';
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @UseFilters(UnauthorizeExceptionFilter)
  @Post('/login/')
  async getLogin(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = await this.authService.login(
      req.user as UserDocument,
    );
    res.cookie('jwt_token', accessToken, {
      httpOnly: true,
      secure: isProd,
    });
    return res.redirect('/profile/');
  }

  @Post('/recover-password/')
  async sendRecoverPasswordLink(
    @Body() updateUserDto: UpdateUserWithEmail,
    @Req() req: Request,
  ) {
    try {
      const isSend = await this.authService.sendRecoverPasswordEmail(
        updateUserDto,
        req,
      );
      // TODO: make user to resend email if !isSend
      return isSend;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Get('/recover-password/:id/:bytes/')
  async recoverPassword(
    @Res() res: Response,
    @Param('id') id: string,
    @Param('bytes') bytes: string,
  ) {
    const can = await this.authService.compareRecoveryAddress({ id, bytes });
    if (!can) return res.redirect('/login/');
    return res.render('pages/recoverPassword');
  }

  @Post('/recover-password/:id/:bytes/')
  async updatePassword(
    @Res() res: Response,
    @Body() updateUserPassword: UpdateUserPasswordDto,
    @Param('id') id: string,
    @Param('bytes') bytes: string,
  ) {
    const can = await this.authService.compareRecoveryAddress({ id, bytes });
    if (!can) return res.redirect('/login/');
    const user = await this.usersService.update(id, {
      password: updateUserPassword.password,
    });
    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @UseFilters(UnauthorizeExceptionFilter)
  @Get('/logout/')
  async getLogout(@Res() res: Response) {
    res.clearCookie('jwt_token');
    return res.redirect('/');
  }
}