import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @IsOptional()
  username: string;

  @IsString()
  @MinLength(0)
  @MaxLength(200)
  @IsOptional()
  about: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  password: string;
}
