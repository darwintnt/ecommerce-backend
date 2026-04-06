#!/bin/bash
echo "Configurando servicios de AWS en LocalStack..."

# 1. Crear tópico SNS para eventos del ecommerce
echo "Creando tópico SNS..."
TOPIC_ARN=$(awslocal sns create-topic \
    --name ecommerce-events \
    --query 'TopicArn' --output text)

echo "Tópico SNS creado: $TOPIC_ARN"

# 2. Crear cola SQS para procesar eventos
echo "Creando cola SQS..."
QUEUE_URL=$(awslocal sqs create-queue \
    --queue-name ecommerce-events-queue \
    --query 'QueueUrl' --output text)

echo "Cola SQS creada: $QUEUE_URL"

# 3. Obtener el ARN de la cola
QUEUE_ARN=$(awslocal sqs get-queue-attributes \
    --queue-url "$QUEUE_URL" \
    --attribute-names QueueArn \
    --query 'Attributes.QueueArn' --output text)

echo "ARN de la cola: $QUEUE_ARN"

# 4. Suscribir la cola SQS al tópico SNS
echo "Suscribiendo cola SQS al tópico SNS..."
awslocal sns subscribe \
    --topic-arn "$TOPIC_ARN" \
    --protocol sqs \
    --notification-endpoint "$QUEUE_ARN"

echo "Suscripción creada exitosamente"

# 5. Crear API Gateway
echo "Creando API Gateway..."

API_ID=$(awslocal apigateway import-rest-api \
    --parameters endpointConfigurationTypes=REGIONAL \
    --body 'file:///etc/localstack/init/ready.d/api-gateway.yml' \
    --query 'id' --output text)

# 6. Desplegar el API en el stage 'dev'
awslocal apigateway create-deployment \
    --rest-api-id "$API_ID" \
    --stage-name dev

echo "==========================================================="
echo "Servicios de AWS configurados exitosamente:"
echo "- SNS Topic ARN: $TOPIC_ARN"
echo "- SQS Queue URL: $QUEUE_URL"
echo "- API Gateway ID: $API_ID"
echo "- API Gateway Products URL: http://localhost:4566/_aws/execute-api/$API_ID/dev/products"
echo "- API Gateway Orders URL: http://localhost:4566/_aws/execute-api/$API_ID/dev/orders"
echo "==========================================================="
