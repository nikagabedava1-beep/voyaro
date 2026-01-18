import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsDateString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateOfferDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerPerson?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inclusions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exclusions?: string[];

  @IsOptional()
  @IsString()
  itinerary?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;
}
