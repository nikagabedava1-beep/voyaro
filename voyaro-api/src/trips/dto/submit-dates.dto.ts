import { IsArray, IsDateString, ArrayMinSize } from 'class-validator';

export class SubmitDatesDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsDateString({}, { each: true })
  availableDates: string[];
}
