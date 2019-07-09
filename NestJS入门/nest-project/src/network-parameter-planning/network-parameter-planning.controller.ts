import { Controller, Get, Post, Res } from '@nestjs/common';
import { NetworkParameterPlanningService } from './network-parameter-planning.service';

// 在这里提供对外接口
@Controller()
export class NetworkParameterPlanningController {
  constructor(private readonly networkParameterPlanningService: NetworkParameterPlanningService) {}

  @Get('GetNetworkTree')
  GetNetworkTree(@Res() res): any {
    return this.networkParameterPlanningService.GetNetworkTree(res);
  }

  @Post('GetNetworkConfParams')
  GetNetworkConfParams(@Res() res): any {
    return this.networkParameterPlanningService.GetNetworkConfParams(res);
  }
}
