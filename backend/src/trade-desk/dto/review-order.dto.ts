import { IsIn, IsString, IsOptional } from 'class-validator';

export class ReviewOrderDto {
  @IsIn(['APPROVE', 'REJECT'])
  action!: 'APPROVE' | 'REJECT';

  @IsString()
  @IsOptional()
  notes?: string;
}
