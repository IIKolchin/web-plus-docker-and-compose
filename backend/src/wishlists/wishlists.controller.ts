import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { RequestWithUser } from '../types/index';
import { JwtGuard } from '../guards/jwt.guard';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    const user = await this.usersService.findOne(req.user.id);
    const wishes = await this.wishesService.findWishes(
      createWishlistDto.itemsId,
    );
    if (!wishes) {
      throw new NotFoundException('Подарки не найдены');
    }
    const wishList = await this.wishlistsService.create(
      createWishlistDto,
      user,
      wishes,
    );
    return wishList;
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wishlist = await this.wishlistsService.findOne(+id);
    if (!wishlist[0]) {
      throw new NotFoundException('Список подарков не найден');
    }
    return wishlist[0];
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: RequestWithUser,
  ) {
    const user = await this.usersService.findOne(req.user.id);
    const wishlist = await this.wishlistsService.findOne(+id);
    if (!wishlist[0]) {
      throw new NotFoundException('Список подарков не найден');
    }
    return this.wishlistsService.update(+id, updateWishlistDto, user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const wishlist = await this.wishlistsService.findOne(+id);
    if (!wishlist[0]) {
      throw new NotFoundException('Список подарков не найден');
    }
    await this.wishlistsService.remove(+id);
    return wishlist[0];
  }
}
