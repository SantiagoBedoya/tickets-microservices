import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export class Ticket {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Number, required: true })
  price: number;
}

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  expiresAt: string;

  @Prop({ type: Ticket, required: true })
  ticket: Ticket;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
