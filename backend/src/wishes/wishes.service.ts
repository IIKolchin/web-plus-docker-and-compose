import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository, Any } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}
  async create(createWishDto: CreateWishDto, user: User) {
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner: user,
    });
    return await this.wishesRepository.save(wish);
  }

  async findLast() {
    const wishes = await this.wishesRepository.find({
      relations: ['owner'],
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
    return wishes;
  }

  async findTop() {
    const wishes = await this.wishesRepository.find({
      relations: ['owner'],
      order: {
        copied: 'DESC',
      },
      take: 10,
    });
    return wishes;
  }

  async findWishes(wishes: number[]) {
    return await this.wishesRepository.find({
      where: { id: Any(wishes) },
    });
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      relations: {
        owner: {
          wishlists: true,
        },
        offers: {
          user: {
            wishes: true,
            offers: true,
            wishlists: {
              owner: true,
              items: true,
            },
          },
        },
        wishlists: {
          items: true,
        },
      },
      where: {
        id: id,
      },
    });
    return wish;
  }

  async update(id: number, updateWishDto: UpdateWishDto, user: User) {
    const wish = await this.wishesRepository.update(id, {
      ...updateWishDto,
      owner: user,
    });
    return wish;
  }

  async remove(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['wishlists'],
    });
    if (wish.wishlists.length !== 0) {
      throw new BadRequestException(
        'Нельзя удалить подарок, который находится в коллекции',
      );
    }
    return await this.wishesRepository.delete(id);
  }

  async copy(id: number, user: User) {
    const wish = await this.wishesRepository.findOneBy({ id });
    const copy = wish.copied + 1;

    await this.wishesRepository.update(id, {
      copied: copy,
    });
    const copyWish = await this.wishesRepository.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: user,
    });
    return await this.wishesRepository.save(copyWish);
  }

  async addRaise(id: number, sum: number) {
    return await this.wishesRepository.update(id, {
      raised: sum,
    });
  }
}
