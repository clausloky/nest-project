import {
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";
import { Location } from "../../locations/entities/location.entity.js";

export class CreateManagerDto {
  @IsString()
  @MaxLength(80)
  managerFullName: string;

  @IsString()
  @IsEmail()
  managerEmail: string;

  @Type(() => Number)
  @IsNumber()
  managerSalary: number;

  @IsString()
  @MaxLength(16)
  managerPhoneNumber: string;

  @IsObject()
  @IsOptional()
  location: Location;
}