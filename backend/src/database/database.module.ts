import { Module, Scope } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Options } from '@mikro-orm/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...(configService.get('mikroorm') as Options),
      }),
      scope: Scope.REQUEST,
    }),
  ],
  exports: [MikroOrmModule],
})
export class DatabaseModule {}
