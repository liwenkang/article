import { ApiModelProperty } from '@nestjs/swagger';

export default class NetAdjustDefaltRuleSaveParam {
  @ApiModelProperty({description: '任务编号', default: 0})
  TaskID: number;
  @ApiModelProperty({description: '网络编号', default: '0'})
  NetNo: string;
  @ApiModelProperty({description: '网络类型', default: 0})
  NetType: number;
  @ApiModelProperty({description: '调配选项', default: 0})
  AdjustOption: number;
  @ApiModelProperty({description: '控制载波调配选项', default: 0})
  MainCarrAdjOption: number;
  @ApiModelProperty({description: '控制载波排列规则', default: 0})
  MainCarrLocRule: number;
  @ApiModelProperty({description: '控制载波排列间隔值', default: 0})
  MainCarrLocValue: number;
  @ApiModelProperty({description: '控制载波分配规则', default: 0})
  MainCarrAsianRule: number;
  @ApiModelProperty({description: '业务资源调配选项', default: 0})
  TraficCarrAdjOption: number;
  @ApiModelProperty({description: '业务资源排列规则', default: 0})
  TraficCarrLocRule: number;
  @ApiModelProperty({description: '业务资源排列间隔值', default: 0})
  TraficCarrLocValue: number;
  @ApiModelProperty({description: '业务资源分配规则', default: 0})
  TraficCarrAsianRule: number;
  @ApiModelProperty({description: '资源不足时自动申请', default: 0})
  ResAutoReqOption: number;
  @ApiModelProperty({description: '调整周期', default: 0})
  AdjFreq: number;
}
