import { IsString, IsBoolean, IsOptional, IsInt, MinLength, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  slug: string;

  @IsString()
  @MinLength(1)
  @MaxLength(10)
  emoji: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  labelEn: string;

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
