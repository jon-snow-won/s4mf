import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';
import {
  APP_ROLES,
  SERVICE_ROLES,
} from '../../common/constants/roles.contrant';
import { Transform } from 'class-transformer';

export class RolesDto {
  @ApiProperty({
    description: 'List of roles',
    enum: { ...APP_ROLES, ...SERVICE_ROLES },
    isArray: true,
  })
  @IsEnum(
    { ...APP_ROLES, ...SERVICE_ROLES },
    {
      each: true,
    },
  )
  @IsArray()
  @Transform(({ value }: any) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  roles: APP_ROLES[] | SERVICE_ROLES[];
}
