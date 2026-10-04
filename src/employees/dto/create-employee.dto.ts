import { IsEmail, IsObject, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Location } from '../../locations/entities/location.entity.js';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  @MaxLength(30)
  employeeName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(70)
  employeeLastName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(10)
  employeePhoneNumber: string;

  @ApiProperty()
  @IsEmail()
  employeeEmail: string;

  @ApiProperty({ type: Location, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => Location)
  location?: Location;
}