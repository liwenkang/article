import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public login(res, userInfoDto): any {
    if (userInfoDto.username === '123' && userInfoDto.password === '123') {
      res.send(userInfoDto);
    } else {
      res.status(401).send('用户名或者密码错误');
    }
  }
}
