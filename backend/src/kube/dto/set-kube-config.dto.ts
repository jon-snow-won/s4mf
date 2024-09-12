import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetKubeConfigDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Base64 encoded kube config' })
  kubeConfigBase64: string;
}
