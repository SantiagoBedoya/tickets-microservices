import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class TicketDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class OrderCreatedDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  expiresAt: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => TicketDto)
  ticket: TicketDto;
}
