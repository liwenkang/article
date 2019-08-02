import { ApiModelProperty } from '@nestjs/swagger';

export default class NetparamlistDto {
  // 这就是一种标记
  @ApiModelProperty({ description: '网络类型', default: 0 })
  systemID: number;
  @ApiModelProperty({ description: '配置状态', default: 0 })
  confStatus: number;
}
