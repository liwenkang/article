// 带有单个路由的基本控制器示例。
import { Req, Res, Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

interface UserInfoDto {
  username: string;
  password: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  // 公有的登陆功能
  @Post('login')
  login(@Res() res, @Body() userInfoDto: UserInfoDto): any {
    return this.appService.login(res, userInfoDto);
  }
}
