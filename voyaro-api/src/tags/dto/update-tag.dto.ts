import { IsString, IsBoolean, IsOptional, IsInt, MinLength, MaxLength } from 'class-validator';

export class UpdateTagDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  slug?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  emoji?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  labelEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  labelKa?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
