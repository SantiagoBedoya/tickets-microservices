import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}
