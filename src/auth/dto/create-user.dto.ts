import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
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
