import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum TicketStatus {
  Available = 'available',
  Reserved = 'reserved',
}

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({
  timestamps: true,
  toJSON: {
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.createdBy;
    },
  },
})
export class Ticket {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, required: true })
  createdBy: string;

  @Prop({ type: String, enum: TicketStatus, default: TicketStatus.Available })
  status: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
