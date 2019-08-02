import { ApiModelProperty } from '@nestjs/swagger';

interface SingleAdvanceDetail {
  SatID: number;
  BeamID: number;
  UpTspdID: number;
  CarrID: number;
  // todo 载波类型 可能不是数字
  CarrType: number;
  AdType: number;
  AdValue: number;
}

export default class SavenetadjustadvancesDto {
  // 这就是一种标记
  @ApiModelProperty({ description: '任务标识', default: 0 })
  taskID: number;
  @ApiModelProperty({ description: '网号', default: 0 })
  netNo: number;
  @ApiModelProperty({ description: '网络类型', default: 0 })
  systemID: number;
  @ApiModelProperty({ description: '调配建议信息', default: [] })
  advanceDetail: SingleAdvanceDetail[];
}
