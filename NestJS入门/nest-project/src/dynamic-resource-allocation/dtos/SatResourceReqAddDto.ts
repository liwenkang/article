import { ApiModelProperty } from '@nestjs/swagger';
import SatResourceReqAddParamDto from './SatResourceReqAddParamDto';

export default class SatResourceReqAddDto {
  // 这就是一种标记
  @ApiModelProperty({ description: '用户ID', default: 0 })
  UserID: number;
  @ApiModelProperty({ description: '任务标识', default: 0 })
  taskID: number;
  @ApiModelProperty({ description: '网号', default: 0 })
  netNo: number;
  @ApiModelProperty({ description: '参数列表', default: 0 })
  paramlist: SatResourceReqAddParamDto[];
}
