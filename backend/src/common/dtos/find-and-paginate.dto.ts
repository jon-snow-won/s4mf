import { FilterQuery } from '@mikro-orm/postgresql';
import { PageOptionsDto } from './page-options.dto';

export class FindAndPaginateDto<T> {
  filter?: FilterQuery<T>;
  pageOptionsDto: PageOptionsDto;
}
