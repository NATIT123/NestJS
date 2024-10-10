import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Body,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ResponseMessage('Login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Req() req: any, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @ResponseMessage('Get User Information')
  @Get('/account')
  getProfile(@User() user: IUser) {
    return user;
  }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    console.log(registerUserDto);
    return this.authService.register(registerUserDto);
  }

  @ResponseMessage('Get User by refresh token')
  @Post('/refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];

    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage('Logout User')
  @Post('/refresh')
  handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true })
    response: Response,
  ) {
    return this.authService.logout(response, user);
  }
}
