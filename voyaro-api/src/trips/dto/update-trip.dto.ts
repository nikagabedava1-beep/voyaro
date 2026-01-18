import { IsString, IsOptional, IsInt, Min, Max, MinLength } from 'class-validator';

export class UpdateTripDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  destination?: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  minParticipants?: number;

  @IsOptional()
  @IsInt()
  @Max(50)
  maxParticipants?: number;
}
