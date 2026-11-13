import { IsEmail, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  @MaxLength(30)
  @IsOptional()
  employeeName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(70)
  @IsOptional()
  employeeLastName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(10)
  @IsOptional()
  employeePhoneNumber: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  employeeEmail: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  location?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  employeePhotoUrl: string;
}