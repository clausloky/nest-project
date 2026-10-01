import { IsEmail, IsString, MinLength, IsOptional, IsIn } from "class-validator";

export class LoginUserDto {
  @IsString()
  @IsEmail()
  userEmail: string;

  @IsString()
  @MinLength(8)
  userPassword: string;

  @IsOptional()
  @IsIn(["Admin", "Manager", "Employee"])
  userRoles: string[];
}
