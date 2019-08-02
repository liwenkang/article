import { ApiModelProperty } from '@nestjs/swagger';

export default class SatResourceReqAddParamDto {
  @ApiModelProperty({description: '卫星ID', default: 0})
  SatID: number;
  @ApiModelProperty({description: '上行波束ID', default: 0})
  UpBeamID: number;
  @ApiModelProperty({description: '下行波束ID', default: 0})
  DownBeamID: number;
  @ApiModelProperty({description: '带宽', default: 0})
  Band: number;
}
