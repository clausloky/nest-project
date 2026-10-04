import { IsEmail, IsString, MinLength, IsOptional, IsIn } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    default: "user@gmail.com"
  })
  @IsString()
  @IsEmail()
  userEmail: string;

  @ApiProperty({
    default: "defaultPass"
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
