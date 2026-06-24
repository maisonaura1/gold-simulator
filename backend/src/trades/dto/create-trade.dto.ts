import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class CreateTradeDto {
  @IsEnum(['BUY', 'SELL'])
  type: 'BUY' | 'SELL';

  @IsNumber()
  @IsPositive()
  @Max(10)
  lot: number;

  @IsNumber()
  @IsPositive()
  entryPrice: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  sl?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  tp?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
