import { ApiModelProperty } from '@nestjs/swagger';

export default class NetMaintenanceAddDto {
  // 这就是一种标记
  @ApiModelProperty({description: '用户ID', default: 0})
  UserID: number;
  @ApiModelProperty({description: '任务标识', default: 0})
  taskID: number;
  @ApiModelProperty({description: '网号', default: 0})
  netNo: number;
  @ApiModelProperty({description: '操作', default: 0})
  Operate: number;
  @ApiModelProperty({description: '影响域', default: ''})
  RelationTarget: string;
  @ApiModelProperty({description: '开始时间', default: ''})
  Starttime: string;
  @ApiModelProperty({description: '结束时间', default: 0})
  EndTime: number;
}
