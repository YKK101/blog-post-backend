import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import RedisStore from 'cache-manager-redis-store';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import config from './config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guard/roles.guard';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    // Third Party Module
    CacheModule.register({
      store: RedisStore,
      url: `redis://${process.env.REDIS_USERNAME}:password@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
    PrismaModule,
    HealthModule,

    // Custom Module
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
