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
      url: process.env.REDIS_URL,
    }),
    HealthModule,
  ],
  providers: [],
})
export class AppModule { }
