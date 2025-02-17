import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) { }

  @Get()
  @HealthCheck()
  async check() {
    const strapiUrl = this.configService.get('strapi.url');

    return this.health.check([
      // Check if Prisma can connect to the database
      () => this.prismaHealth.pingCheck('database', this.prisma),
      // Check if Strapi is accessible
      () => this.http.pingCheck('strapi', strapiUrl),
    ]);
  }
}
