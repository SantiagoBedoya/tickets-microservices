# Tickets Microservices

## How to run

1. Install [docker](https://github.com/SantiagoBedoya/tickets-microservices/blob/main/images/tickets-ms.png)
2. Execute

```bash
docker-compose up -d
```

![Architecture](/assets/images/tux.png)

## Components and technologies

- Auth (Nestjs, MongoDB, gRPC)
- auth-npm - Common Auth Package (Nestjs, gRPC)
- Tickets (Nestjs, MongoDB, RabbitMQ)
- Orders (Nestjs, MongoDB, RabbitMQ)
