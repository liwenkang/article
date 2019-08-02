import { ApiModelProperty } from '@nestjs/swagger';

export default class SatResourceReqTaskDto {
  // 这就是一种标记
  @ApiModelProperty({ description: '任务状态', default: 0 })
  TaskStatus: number;
}
