import { ApiModelProperty } from '@nestjs/swagger';

export default class EquipmentMaintenanceTaskAddDto {
  // 这就是一种标记
  @ApiModelProperty({ description: '用户ID', default: '' })
  UserID: number;
  @ApiModelProperty({ description: '设备名称', default: '' })
  EquipmentID: number;
  @ApiModelProperty({ description: '操作', default: '' })
  Operate: number;
  @ApiModelProperty({ description: '影响域', default: '' })
  RelationTarget: string;
  @ApiModelProperty({ description: '开始时间', default: '' })
  Starttime: string;
  @ApiModelProperty({ description: '结束时间', default: '' })
  EndTime: number;
}
