import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { WishesService } from './wishes.service';
import { UsersService } from '../users/users.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { RequestWithUser } from '../types';

@Controller('wishes')
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createWishDto: CreateWishDto,
  ) {
    const user = await this.usersService.findOne(req.user.id);
    const wish = await this.wishesService.create(createWishDto, user);

    return wish;
  }

  @Get('last')
  async findLast() {
    const wishes = await this.wishesService.findLast();
    if (!wishes) {
      throw new NotFoundException('Подарки не найдены');
    }
    return wishes;
  }

  @Get('top')
  async findTop() {
    const wishes = await this.wishesService.findTop();
    if (!wishes) {
      throw new NotFoundException('Подарки не найдены');
    }
    return wishes;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wish = await this.wishesService.findOne(+id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return wish;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const user = await this.usersService.findOne(req.user.id);
    const wish = await this.wishesService.findOne(+id);
    if (req.user.id !== wish.owner.id) {
      throw new BadRequestException('Редактировать можно только свои подарки');
    }
    if (wish.offers.length !== 0) {
      throw new BadRequestException(
        'Нельзя изменять стоимость подарка, когда есть желающие скинуться',
      );
    }
    return this.wishesService.update(+id, updateWishDto, user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const wish = await this.wishesService.findOne(+id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    await this.wishesService.remove(+id);
    return wish;
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(@Param('id') id: string, @Req() req: RequestWithUser) {
    const user = await this.usersService.findOne(req.user.id);
    const wish = await this.wishesService.findOne(+id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return this.wishesService.copy(+id, user);
  }
}
