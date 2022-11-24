import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  IsUrl,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
