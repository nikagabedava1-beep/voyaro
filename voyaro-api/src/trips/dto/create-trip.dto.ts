import { IsString, IsOptional, IsInt, Min, Max, MinLength, IsArray } from 'class-validator';

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
  @IsInt()
  @Min(2)
  minParticipants?: number;

  @IsOptional()
  @IsInt()
  @Max(50)
  maxParticipants?: number;
}
