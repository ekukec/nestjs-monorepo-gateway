import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Health')
@Controller('health')
@SkipThrottle()
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private microservice: MicroserviceHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    @ApiOperation({ summary: 'Check gateway health' })
    check() {
    return this.health.check([
        () =>
        this.microservice.pingCheck('authentication', {
            transport: Transport.TCP,
            options: {
            host: process.env.AUTH_TCP_HOST || 'localhost',
            port: parseInt(process.env.AUTH_TCP_PORT || "3001"),
            },
        }),
    ]);
    }

    @Get('ready')
    @ApiOperation({ summary: 'Check if gateway is ready to serve requests' })
    readiness() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }

    @Get('live')
    @ApiOperation({ summary: 'Check if gateway is alive' })
    liveness() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }
}