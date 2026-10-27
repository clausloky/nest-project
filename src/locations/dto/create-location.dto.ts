import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

import { Region } from "../../regions/entities/region.entity.js";

export class CreateLocationDto {
  @IsString()
  @MaxLength(35)
  locationName: string;

  @IsString()
  @MaxLength(160)
  locationAdress: string;

  @IsArray()
  @ArrayNotEmpty()
  locationLatLng: number[];

  @IsOptional()
  region: Region;

  @IsUUID()
  @IsOptional()
  manager: string;
}