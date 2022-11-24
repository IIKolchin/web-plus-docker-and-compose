import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishListsRepository: Repository<Wishlist>,
  ) {}
  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
    wishes: Wish[],
  ) {
    const wishList = await this.wishListsRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
    return await this.wishListsRepository.save(wishList);
  }

  async findAll() {
    return await this.wishListsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.wishListsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, user: User) {
    const wishlist = await this.wishListsRepository.update(id, {
      ...updateWishlistDto,
      owner: user,
    });
    return wishlist;
  }

  async remove(id: number) {
    return await this.wishListsRepository.delete(id);
  }
}
