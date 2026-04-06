/* eslint-disable @typescript-eslint/require-await */
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from '@aws-sdk/client-sqs';
import { DomainEvent } from './domain-events';

export interface EventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>;
}

@Injectable()
export class EventConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventConsumerService.name);
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;
  private polling = false;
  private readonly handlers = new Map<string, EventHandler>();

  constructor() {
    const awsEndpoint = process.env.AWS_ENDPOINT || 'http://localhost:4566';
    const awsRegion = process.env.AWS_REGION || 'us-east-1';

    this.sqsClient = new SQSClient({
      region: awsRegion,
      endpoint: awsEndpoint,
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });

    this.queueUrl =
      process.env.SQS_QUEUE_URL ||
      'http://localhost:4566/000000000000/ecommerce-events-queue';
  }

  registerHandler(eventType: string, handler: EventHandler): void {
    this.handlers.set(eventType, handler);
    this.logger.log(`Handler registered for event type: ${eventType}`);
  }

  async onModuleInit() {
    this.polling = true;
    void this.startPolling();
  }

  async onModuleDestroy() {
    this.polling = false;
  }

  private async startPolling() {
    while (this.polling) {
      try {
        await this.pollMessages();
      } catch (error) {
        this.logger.error('Error polling messages', error);
      }
      // Esperar un poco antes de volver a consultar
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  private async pollMessages() {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 5,
        MessageAttributeNames: ['All'],
      });

      const response = await this.sqsClient.send(command);

      if (response.Messages && response.Messages.length > 0) {
        await Promise.all(
          response.Messages.map((message) => this.processMessage(message)),
        );
      }
    } catch (error) {
      this.logger.error('Error receiving messages', error);
    }
  }

  private async processMessage(message: Message) {
    try {
      if (!message.Body) {
        this.logger.warn('Received message without body');
        return;
      }

      // SNS envuelve el mensaje en un objeto con Message
      const snsMessage = JSON.parse(message.Body);
      const eventData = JSON.parse(snsMessage.Message);
      const event = eventData as DomainEvent;

      this.logger.log(`Processing event: ${event.eventType}`);

      const handler = this.handlers.get(event.eventType);
      if (handler) {
        await handler.handle(event);
        this.logger.log(`Event processed successfully: ${event.eventType}`);

        // Eliminar mensaje de la cola después de procesarlo
        if (message.ReceiptHandle) {
          await this.deleteMessage(message.ReceiptHandle);
        }
      } else {
        this.logger.warn(
          `No handler registered for event type: ${event.eventType}`,
        );
      }
    } catch (error) {
      this.logger.error('Error processing message', error);
      // Si falla, el mensaje volverá a estar disponible en la cola
    }
  }

  private async deleteMessage(receiptHandle: string) {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      });
      await this.sqsClient.send(command);
    } catch (error) {
      this.logger.error('Error deleting message', error);
    }
  }
}
