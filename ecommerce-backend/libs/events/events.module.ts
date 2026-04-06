import { Module, Global } from '@nestjs/common';
import { EventPublisherService } from './event-publisher.service';
import { EventConsumerService } from './event-consumer.service';

@Global()
@Module({
  providers: [EventPublisherService, EventConsumerService],
  exports: [EventPublisherService, EventConsumerService],
})
export class EventsModule {}
