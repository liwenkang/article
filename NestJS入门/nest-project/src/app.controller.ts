// 带有单个路由的基本控制器示例。
import { Controller } from '@nestjs/common';
import AppService from './app.service';

@Controller()
export default class AppController {
  constructor(private readonly appService: AppService) {
  }
}
