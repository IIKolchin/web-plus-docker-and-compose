import { IsString, IsArray, IsUrl } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  name: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];
}
