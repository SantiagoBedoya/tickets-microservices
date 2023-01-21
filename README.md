# Tickets Microservices

## How to run

1. Install [docker](https://docs.docker.com/get-docker/)
2. Execute

```bash
docker-compose up -d
```

![Architecture](https://github.com/SantiagoBedoya/tickets-microservices/blob/main/images/tickets-ms.png)

## Components and technologies

- Auth (Nestjs, MongoDB, gRPC)
- auth-npm - Common Auth Package (Nestjs, gRPC)
- Tickets (Nestjs, MongoDB, RabbitMQ)
- Orders (Nestjs, MongoDB, RabbitMQ)
