import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import RedisStore from 'cache-manager-redis-store';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PrismaModule,
    CacheModule.register({
      store: RedisStore,
      url: `redis://${process.env.REDIS_USERNAME}:password@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
    HealthModule,
  ],
  providers: [],
})
export class AppModule { }
