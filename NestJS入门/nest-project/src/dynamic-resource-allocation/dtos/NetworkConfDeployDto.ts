import { ApiModelProperty } from '@nestjs/swagger';

export default class NetworkConfDeployDto {
  // 这就是一种标记
  @ApiModelProperty({ description: '任务标识', default: 0 })
  taskID: number;
  @ApiModelProperty({ description: '网号', default: 0 })
  netNo: number;
  @ApiModelProperty({ description: '网络参数版本', default: 0 })
  NetPlanVersion: number;
}
