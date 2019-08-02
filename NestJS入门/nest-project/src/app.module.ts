import { Module } from '@nestjs/common';
import AppController from './app.controller';
import AppService from './app.service';
import NetworkParameterPlanningController from './network-parameter-planning/network-parameter-planning.controller';
import NetworkParameterPlanningService from './network-parameter-planning/network-parameter-planning.service';
import DynamicResourceAllocationController from './dynamic-resource-allocation/dynamic-resource-allocation.controller';
import DynamicResourceAllocationService from './dynamic-resource-allocation/dynamic-resource-allocation.service';
import EventsModule from './websocket-events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [AppController, NetworkParameterPlanningController, DynamicResourceAllocationController],
  providers: [AppService, NetworkParameterPlanningService, DynamicResourceAllocationService],
})
export class AppModule {
}
