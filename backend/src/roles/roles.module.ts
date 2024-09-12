import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Role } from './entities/role.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
