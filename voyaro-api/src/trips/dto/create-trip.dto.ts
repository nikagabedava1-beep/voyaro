import { IsString, IsOptional, IsInt, IsNumber, Min, Max, MinLength, IsArray } from 'class-validator';

export class CreateTripDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @MinLength(1)
  destination: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedTags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  minBudget?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxBudget?: number;

  @IsOptional()
  @IsInt()
  @Min(2)
  minParticipants?: number;

  @IsOptional()
  @IsInt()
  @Max(50)
  maxParticipants?: number;
}
