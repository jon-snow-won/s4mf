import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSimplePodDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;
}
