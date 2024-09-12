import { IsNotEmpty, IsNumber } from 'class-validator';

export class SetActiveStructureDto {
  @IsNotEmpty()
  @IsNumber()
  structureId: number;
}
