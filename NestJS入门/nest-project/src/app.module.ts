import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NetworkParameterPlanningController } from './network-parameter-planning/network-parameter-planning.controller';
import { NetworkParameterPlanningService } from './network-parameter-planning/network-parameter-planning.service';

// 应用程序的根模块。
@Module({
  imports: [],
  controllers: [AppController, NetworkParameterPlanningController],
  providers: [AppService, NetworkParameterPlanningService],
})
export class AppModule {
}
