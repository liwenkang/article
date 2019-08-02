import { ApiModelProperty } from '@nestjs/swagger';

export default class NetAdjustDesisonRuleSaveParamDto {
  @ApiModelProperty({ description: '参数类别', default: 0 })
  ParamType: number;
  @ApiModelProperty({ description: '参数类别名称', default: '' })
  ParamTypeName: string;
  @ApiModelProperty({ description: '参数编号', default: 0 })
  ParaId: number;
  @ApiModelProperty({ description: '字段名称', default: '' })
  Paraname: string;
  @ApiModelProperty({ description: '是否选中', default: 0 })
  Selected: number;
  @ApiModelProperty({ description: '阈值参数属性', default: 0 })
  thresholdProperty: number;
  @ApiModelProperty({ description: '阈值参数可能取值范围', default: '' })
  ValueList: string;
  @ApiModelProperty({ description: '阈值参数最小值', default: 0 })
  MinparamValue: number;
  @ApiModelProperty({ description: '阈值参数最大值', default: 0 })
  MaxparamValue: number;
  @ApiModelProperty({ description: '频度', default: 0 })
  FreqPercent: number;
}
