import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { RequestWithUser } from '../types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  me(@Req() req: RequestWithUser) {
    const { id } = req.user;
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  async getByUsername(@Param() params: { username: string }) {
    const user = await this.usersService.findUserByUsername(params.username);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getMyWishes(@Req() req: RequestWithUser) {
    const { id } = req.user;
    return await this.usersService.findWishes(id);
  }

  @UseGuards(JwtGuard)
  @Get('me/:username')
  async getByUserName(@Param() params: { username: string }) {
    const user = await this.usersService.findByUsername(params.username);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async update(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!req.user) {
      throw new NotFoundException('Редактировать можно только свои данные');
    }
    const { id } = req.user;
    await this.usersService.update(id, updateUserDto);
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Post('find')
  async findMany(@Body() body: { query: string }) {
    return await this.usersService.findMany(body.query);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  async getUsersWishes(@Param() params: { username: string }) {
    const user = await this.usersService.findUserByUsername(params.username);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return await this.usersService.findWishes(user.id);
  }
}
