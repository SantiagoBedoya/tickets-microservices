class TicketDto {
  id: string;
  title: string;
  price: number;
}

export class OrderCreatedDto {
  id: string;
  status: string;
  userId: string;
  expiresAt: string;
  ticket: TicketDto;
}
