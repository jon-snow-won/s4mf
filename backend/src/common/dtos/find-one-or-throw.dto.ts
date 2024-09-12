import { FilterQuery } from '@mikro-orm/postgresql';

export class FindOneOrThrowDto<T> {
  filter: FilterQuery<T>;
  populateOptions?: string[] | [];
  fieldsOptions?: string[] | undefined;
  withDeleted?: boolean = false;
}
