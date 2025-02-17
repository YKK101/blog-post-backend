import { Controller, Get } from '@nestjs/common';
import { RedisOptions, Transport } from '@nestjs/microservices';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, PrismaHealthIndicator, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private microService: MicroserviceHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) { }

  @Get()
  @HealthCheck()
  async check() {
    const strapiUrl = this.configService.get('strapi.url');
    const redisUrl = this.configService.get('redis.url');
    console.log(strapiUrl, redisUrl);

    return this.health.check([
      // Check if Prisma can connect to the database
      () => this.prismaHealth.pingCheck('database', this.prisma),
      // Check if Strapi is accessible
      () => this.http.pingCheck('strapi', strapiUrl),
      // Check if Redis is accessible
      async () => this.microService.pingCheck<RedisOptions>('redis', {
        transport: Transport.REDIS,
        options: {
          host: 'blog_post_redis',
          port: 6379,
          password: 'password'
        },
      }),
    ]);
  }
}
