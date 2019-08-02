import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import NetworkParameterPlanningService from './network-parameter-planning.service';
import GetNetworkConfParamsDto from './dtos/GetNetworkConfParamsDto';
import NetPlanSendDto from './dtos/NetPlanSendDto';
import NetSyncDto from './dtos/NetSyncDto';
import UserInfoDto from './dtos/UserInfoDto';

// 在这里提供对外接口
@Controller('network-parameter-planning')
export default class NetworkParameterPlanningController {
  constructor(private readonly networkParameterPlanningService: NetworkParameterPlanningService) {
  }

  // 登陆页面
  @Post('Login')
  Login(@Res() res, @Body() userInfoDto: UserInfoDto): any {
    return this.networkParameterPlanningService.Login(res, userInfoDto);
  }

  @Get('GetNetworkTree')
  GetNetworkTree(): any {
    return this.networkParameterPlanningService.GetNetworkTree();
  }

  @Post('GetNetworkConfParams')
  GetNetworkConfParams(@Body() GetNetworkConfParams: GetNetworkConfParamsDto): any {
    return this.networkParameterPlanningService.GetNetworkConfParams();
  }

  // 网络下发接口
  @Post('NetPlanSend')
  NetPlanSend(@Body() NetPlanSend: NetPlanSendDto): any {
    return this.networkParameterPlanningService.NetPlanSend();
  }

  // 网络同步接口
  @Post('NetSync')
  NetSync(@Body() NetSync: NetSyncDto): any {
    return this.networkParameterPlanningService.NetSync();
  }
}
