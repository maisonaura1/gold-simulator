import { IsString, IsIn, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  bookId!: string;

  @IsString()
  @IsOptional()
  symbol?: string; // normalized to XAUUSD regardless

  @IsIn(['BUY', 'SELL'])
  side!: 'BUY' | 'SELL';

  @IsNumber()
  @IsPositive()
  quantity!: number;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
