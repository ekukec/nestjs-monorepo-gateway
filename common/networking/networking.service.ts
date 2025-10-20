import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NetworkingService implements OnModuleInit {
  private authClient: ClientProxy;

  onModuleInit() {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_TCP_HOST || 'localhost',
        port: parseInt(process.env.AUTH_TCP_PORT || "3001"),
      },
    });
  }

  getAuthClient(): ClientProxy {
    return this.authClient;
  }

  async sendToAuth<T>(pattern: any, data: any): Promise<T> {
    return firstValueFrom(this.authClient.send<T>(pattern, data));
  }
}