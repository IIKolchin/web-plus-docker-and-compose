import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HashProvider } from '../helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await HashProvider.generateHash(
      createUserDto.password,
    );
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hashedPassword = await HashProvider.generateHash(
        updateUserDto.password,
      );
      return await this.usersRepository.update(
        { id },
        {
          ...updateUserDto,
          password: hashedPassword,
        },
      );
    } else {
      return await this.usersRepository.update({ id }, updateUserDto);
    }
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      select: {
        id: true,
        username: true,
        password: true,
      },
      where: {
        username,
      },
    });
    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        username: username,
      },
    });
    return user;
  }

  async validateJwt(id: number) {
    return await this.usersRepository.find({
      select: {
        id: true,
        username: true,
      },
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async findMany(query: string) {
    const user = await this.usersRepository.find({
      where: [{ username: query }, { email: query }],
    });
    return user;
  }

  async findWishes(id: number) {
    await this.usersRepository.findOneBy({ id });
    const wishes = await this.usersRepository.find({
      select: ['wishes'],
      relations: {
        wishes: {
          owner: true,
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
        },
      },
      where: {
        id: id,
      },
    });
    const wishesArr = wishes.map((item) => item.wishes);
    return wishesArr[0];
  }
}
