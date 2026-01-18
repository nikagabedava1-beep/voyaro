import { IsNumber, IsOptional, IsArray, IsString, IsEnum, Min } from 'class-validator';
import { ComfortLevel } from '@prisma/client';

export class SubmitPreferencesDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  minBudget?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxBudget?: number;

  @IsOptional()
  @IsEnum(ComfortLevel)
  comfortLevel?: ComfortLevel;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mustHaves?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  niceToHaves?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dealBreakers?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
