import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Ticket } from './ticket.entity';

export enum OrderStatus {
  Created = 'created',
  Cancelled = 'cancelled',
  AwaitingPayment = 'awaiting:payment',
  Complete = 'complete',
}

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
  toJSON: {
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.userId;
    },
  },
})
export class Order {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.Created })
  status: string;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  expiresAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' })
  ticket: Ticket;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
