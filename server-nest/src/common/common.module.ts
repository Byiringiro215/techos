import { Module, Global } from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary.service';
import { RedisService } from './services/redis.service';
import { EmailService } from './services/email.service';
import { EventsGateway } from './gateways/events.gateway';

@Global()
@Module({
  providers: [CloudinaryService, RedisService, EmailService, EventsGateway],
  exports: [CloudinaryService, RedisService, EmailService, EventsGateway],
})
export class CommonModule {}
