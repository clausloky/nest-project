import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { Location } from "../../locations/entities/location.entity.js";

export class CreateManagerDto {
  @IsString()
  @MaxLength(80)
  managerFullName: string;

  @IsString()
  @IsEmail()
  managerEmail: string;

  @IsNumber()
  managerSalary: number;

  @IsString()
  @MaxLength(16)
  managerPhoneNumber: string;

  @IsNumber()
  @IsOptional()
  location: Location;
}