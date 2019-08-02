import { ApiModelProperty } from '@nestjs/swagger';

export default class NetAdjustRuleReqDto {
  // 这就是一种标记
  @ApiModelProperty({description: '任务标识', default: 0})
  taskID: number;
  @ApiModelProperty({description: '网络类型', default: 0})
  systemID: number;
  @ApiModelProperty({description: '网号', default: 0})
  netNo: number;
}
