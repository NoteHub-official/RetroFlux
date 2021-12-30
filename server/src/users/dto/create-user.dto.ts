import { IsNotEmpty, IsEmail, MaxLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(30)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(30)
  email: string;

  @IsNotEmpty()
  @MaxLength(30)
  password: string;

  @IsOptional()
  @MaxLength(30)
  firstName?: string;

  @IsOptional()
  @MaxLength(30)
  lastName?: string;

  @IsOptional()
  description?: string;
}
