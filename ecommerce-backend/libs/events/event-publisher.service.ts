import { Injectable, Logger } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { DomainEvent } from './domain-events';

@Injectable()
export class EventPublisherService {
  private readonly logger = new Logger(EventPublisherService.name);
  private readonly snsClient: SNSClient;
  private readonly topicArn: string;

  constructor() {
    const awsEndpoint = process.env.AWS_ENDPOINT || 'http://localhost:4566';
    const awsRegion = process.env.AWS_REGION || 'us-east-1';

    this.snsClient = new SNSClient({
      region: awsRegion,
      endpoint: awsEndpoint,
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });

    this.topicArn =
      process.env.SNS_TOPIC_ARN ||
      'arn:aws:sns:us-east-1:000000000000:ecommerce-events';
  }

  async publishEvent(event: DomainEvent): Promise<void> {
    try {
      const command = new PublishCommand({
        TopicArn: this.topicArn,
        Message: JSON.stringify(event),
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: event.eventType,
          },
        },
      });

      const response = await this.snsClient.send(command);
      this.logger.log(`Event published successfully: ${event.eventType}`, {
        messageId: response.MessageId,
      });
    } catch (error) {
      this.logger.error(`Failed to publish event: ${event.eventType}`, error);
      throw error;
    }
  }
}
