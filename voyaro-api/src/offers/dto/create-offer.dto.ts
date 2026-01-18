import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsDateString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateOfferDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsNumber()
  @Min(0)
  pricePerPerson: number;

  @IsArray()
  @IsString({ each: true })
  inclusions: string[];

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
