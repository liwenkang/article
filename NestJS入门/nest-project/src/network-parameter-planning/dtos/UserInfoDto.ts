import { ApiModelProperty } from '@nestjs/swagger';

export default class UserInfoDto {
  // 这就是一种标记
  @ApiModelProperty({description: '用户名', default: 'admin'})
  username: string;

  @ApiModelProperty({description: '密码', default: 'password'})
  password: string;
}
