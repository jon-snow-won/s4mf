import { ObjectDiff } from '@donedeal0/superdiff';
import { ApiProperty } from '@nestjs/swagger';

export type ObjectDiffStatus = 'added' | 'equal' | 'deleted' | 'updated';
export enum ObjectDiffStatusEnum {
  ADDED = 'added',
  EQUAL = 'equal',
  DELETED = 'deleted',
  UPDATED = 'updated',
}

export class ObjectDiffDetails {
  @ApiProperty({ type: String })
  property: string;

  @ApiProperty({ type: Object })
  previousValue: object;

  @ApiProperty()
  currentValue: any;

  @ApiProperty({ enum: ObjectDiffStatusEnum })
  status: ObjectDiffStatus;

  @ApiProperty()
  subPropertiesDiff?: ObjectDiffDetails[];
}

export class ObjectDiffSummary implements ObjectDiff {
  @ApiProperty({ type: String, enum: ['object'] })
  type: 'object';

  @ApiProperty({ enum: ObjectDiffStatusEnum })
  status: ObjectDiffStatus;

  @ApiProperty()
  diff: ObjectDiffDetails[];
}

export class ObjectDiffDto {
  @ApiProperty({ type: Number })
  fromId: number;

  @ApiProperty({ type: Number })
  toId: number;

  @ApiProperty({ type: ObjectDiffSummary })
  diffSummary: ObjectDiffSummary;
}

export class ObjectDiffMeta {
  entityIdx: string;
  revisionCount: number;
}

export class RevisionsDiffResponse {
  meta: ObjectDiffMeta;
  diffList: ObjectDiffDto[];
}
