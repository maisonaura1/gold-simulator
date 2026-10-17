import { IsBoolean, IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export class SaveProgressDto {
  @IsString()
  @MaxLength(80)
  @Matches(/^n\d-[a-z0-9-]+$/, { message: 'lessonId inválido' })
  lessonId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  quizScore?: number;

  @IsOptional()
  @IsBoolean()
  practiceDone?: boolean;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
