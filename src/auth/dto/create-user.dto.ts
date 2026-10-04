import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: "user@gmail.com"
  })
  @IsString()
  @IsEmail()
  userEmail: string;
  @ApiProperty({
    default: "98127398123"
  })
  @IsString()
  @MinLength(8)
  userPassword: string;
  @ApiProperty({
    default: "Employee"
  })
  @IsOptional()
  @IsIn(["Admin", "Manager", "Employee"])
  userRoles: string[];
}
