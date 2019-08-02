import { ApiModelProperty } from '@nestjs/swagger';

export default class ResourceStatusDto {
  // 这就是一种标记
  @ApiModelProperty({ description: '查询范围', default: 0 })
  Range: number;
  @ApiModelProperty({ description: '卫星编号', default: 0 })
  SatID: number;
  @ApiModelProperty({ description: '波束编号', default: 0 })
  BeamID: number;
  @ApiModelProperty({ description: '转发器编号', default: 0 })
  TspdID: number;
}
