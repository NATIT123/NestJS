import { AuthService } from './auth/auth.service';
import {
  Controller,
  Get,
  Post,
  Render,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/customize';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get()
  @Render('home')
  handleHomePage() {
    ///Port form ENV
    console.log(`Port:${this.configService.get<string>('PORT')}`);
    const message1 = this.appService.getHello();

    return {
      message: message1,
    };
  }
}
