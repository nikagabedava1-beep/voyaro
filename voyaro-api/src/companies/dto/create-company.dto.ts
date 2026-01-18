import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  Max,
  MinLength,
  IsUrl,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsArray()
  @IsString({ each: true })
  destinations: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  minGroupSize?: number;

  @IsOptional()
  @IsInt()
  @Max(100)
  maxGroupSize?: number;
}
