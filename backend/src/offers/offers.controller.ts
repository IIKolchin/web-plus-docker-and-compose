import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { RequestWithUser } from '../types';
import { JwtGuard } from '../guards/jwt.guard';
import { UsersService } from 'src/users/users.service';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req: RequestWithUser,
  ) {
    const { id } = req.user;
    const user = await this.usersService.findOne(id);
    return await this.offersService.create(createOfferDto, user);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    const offers = await this.offersService.findAll();
    if (!offers) {
      throw new NotFoundException('Заявки не найдены');
    }
    return offers;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const offer = await this.offersService.findOne(+id);
    if (!offer) {
      throw new NotFoundException('Заявка не найдена');
    }
    return offer;
  }
}
