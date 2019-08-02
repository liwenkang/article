import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import DynamicResourceAllocationService from './dynamic-resource-allocation.service';
import ResourceStatusDto from './dtos/ResourceStatusDto';
import TspdRelationDto from './dtos/TspdRelationDto';
import NetparamlistDto from './dtos/NetparamlistDto';
import NetworkConfDeployDto from './dtos/NetworkConfDeployDto';
import NetAdjustRuleReqDto from './dtos/NetAdjustRuleReqDto';
import SatResourceReqTaskDto from './dtos/SatResourceReqTaskDto';
import SatResourceReqAddDto from './dtos/SatResourceReqAddDto';
import MaintenanceTaskDto from './dtos/MaintenanceTaskDto';
import NetMaintenanceAddDto from './dtos/NetMaintenanceAddDto';
import EquipmentMaintenanceTaskAddDto from './dtos/EquipmentMaintenanceTaskAddDto';
import NetworkMessageReqDto from './dtos/NetworkMessageReqDto';
import NetparamdetailDto from './dtos/NetparamdetailDto';
import SavenetadjustadvancesDto from './dtos/SavenetadjustadvancesDto';
import NetadjustplanDto from './dtos/NetadjustplanDto';
import NetAdjustDesisonRuleSaveDto from './dtos/NetAdjustDesisonRuleSaveDto';
import NetAdjustDefaltRuleSaveDto from './dtos/NetAdjustDefaltRuleSaveDto';
import NetAdjustRuleSaveDto from './dtos/NetAdjustRuleSaveDto';
import UserInfoDto from './dtos/UserInfoDto';

@Controller('dynamic-resource-allocation')
export default class DynamicResourceAllocationController {
  constructor(private readonly dynamicResourceAllocationService: DynamicResourceAllocationService) {
  }

  // 登陆页面
  @Post('/Login')
  Login(@Res() res, @Body() userInfoDto: UserInfoDto): any {
    return this.dynamicResourceAllocationService.Login(res, userInfoDto);
  }

  @Get('GetNetworkTree')
  GetNetworkTree(): any {
    return this.dynamicResourceAllocationService.GetNetworkTree();
  }

  @Get('/dra/comm/ResourceStatus')
  ResourceStatus(@Param() ResourceStatus: ResourceStatusDto): any {
    return this.dynamicResourceAllocationService.ResourceStatus(ResourceStatus);
  }

  @Get('/dra/comm/TspdRelation')
  TspdRelation(@Param() TspdRelation: TspdRelationDto): any {
    return this.dynamicResourceAllocationService.TspdRelation();
  }

  @Get('/dra/netadjust/netparamlist')
  netparamlist(@Param() netparamlist: NetparamlistDto): any {
    return this.dynamicResourceAllocationService.netparamlist();
  }

  @Post('NetworkConfDeploy')
  NetworkConfDeploy(@Body() NetworkConfDeploy: NetworkConfDeployDto): any {
    return this.dynamicResourceAllocationService.NetworkConfDeploy();
  }

  @Get('/dra/netadjust/netparamdetail')
  netparamdetail(@Param() netparamdetail: NetparamdetailDto): any {
    return this.dynamicResourceAllocationService.netparamdetail();
  }

  @Post('/dra/netadjust/savenetadjustadvances')
  savenetadjustadvances(@Body() savenetadjustadvances: SavenetadjustadvancesDto): any {
    return this.dynamicResourceAllocationService.savenetadjustadvances();
  }

  @Post('/dra/netadjust/netadjustplan')
  netadjustplan(@Body() netadjustplan: NetadjustplanDto[]): any {
    return this.dynamicResourceAllocationService.netadjustplan();
  }

  @Get('NetAdjustDesisonRuleReq')
  NetAdjustDesisonRuleReq(): any {
    return this.dynamicResourceAllocationService.NetAdjustDesisonRuleReq();
  }

  @Post('NetAdjustDesisonRuleSave')
  NetAdjustDesisonRuleSave(@Body() NetAdjustDesisonRuleSave: NetAdjustDesisonRuleSaveDto): any {
    return this.dynamicResourceAllocationService.NetAdjustDesisonRuleSave();
  }

  @Get('NetAdjustDefaltRuleReq')
  NetAdjustDefaltRuleReq(): any {
    return this.dynamicResourceAllocationService.NetAdjustDefaltRuleReq();
  }

  @Post('NetAdjustDefaltRuleSave')
  NetAdjustDefaltRuleSave(@Body() NetAdjustDefaltRuleSave: NetAdjustDefaltRuleSaveDto): any {
    return this.dynamicResourceAllocationService.NetAdjustDefaltRuleSave();
  }

  @Get('NetAdjustRuleReq')
  NetAdjustRuleReq(@Param() NetAdjustRuleReq: NetAdjustRuleReqDto): any {
    return this.dynamicResourceAllocationService.NetAdjustRuleReq();
  }

  @Post('NetAdjustRuleSave')
  NetAdjustRuleSave(@Body() NetAdjustRuleSave: NetAdjustRuleSaveDto): any {
    return this.dynamicResourceAllocationService.NetAdjustRuleSave();
  }

  @Get('SatResourceReqTask')
  SatResourceReqTask(@Param() SatResourceReqTask: SatResourceReqTaskDto): any {
    return this.dynamicResourceAllocationService.SatResourceReqTask();
  }

  @Post('SatResourceReqAdd')
  SatResourceReqAdd(@Body() SatResourceReqAdd: SatResourceReqAddDto): any {
    return this.dynamicResourceAllocationService.SatResourceReqAdd();
  }

  @Get('MaintenanceTask')
  MaintenanceTask(@Param() MaintenanceTask: MaintenanceTaskDto): any {
    return this.dynamicResourceAllocationService.MaintenanceTask();
  }

  @Post('NetMaintenanceAdd')
  NetMaintenanceAdd(@Body() NetMaintenanceAdd: NetMaintenanceAddDto): any {
    return this.dynamicResourceAllocationService.NetMaintenanceAdd();
  }

  @Post('EquipmentMaintenanceTaskAdd')
  EquipmentMaintenanceTaskAdd(@Body() EquipmentMaintenanceTaskAdd: EquipmentMaintenanceTaskAddDto): any {
    return this.dynamicResourceAllocationService.EquipmentMaintenanceTaskAdd();
  }

  @Get('NetworkMessageReq')
  NetworkMessageReq(@Param() NetworkMessageReq: NetworkMessageReqDto) {
    return this.dynamicResourceAllocationService.NetworkMessageReq();
  }
}
