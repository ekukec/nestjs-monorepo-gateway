import { Module } from '@nestjs/common';
import { NetworkingService } from './networking.service';

@Module({
    providers: [NetworkingService],
    exports: [NetworkingService],
})
export class NetworkingModule {}