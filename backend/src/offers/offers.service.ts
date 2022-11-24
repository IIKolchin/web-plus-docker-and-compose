import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from '../wishes/wishes.service';
import { EmailSenderService } from '../email-sender/email-sender.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly emailSenderService: EmailSenderService,
    private readonly usersService: UsersService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);
    const currentUser = await this.usersService.findOne(user.id);
    const sum = wish.raised + createOfferDto.amount;

    await this.wishesService.addRaise(createOfferDto.itemId, sum);
    const offer = await this.offerRepository.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });
    await this.offerRepository.save(offer);

    if (wish.owner.id === user.id) {
      throw new BadRequestException(
        'Нельзя вносить деньги на собственные подарки',
      );
    }

    if (sum > wish.price) {
      throw new BadRequestException('Сумма превышает стоимость подарка');
    }

    if (wish.raised === wish.price) {
      throw new BadRequestException('Необходимая сумма уже собрана');
    }
    if (sum === wish.price) {
      const usersEmail = wish.offers.map((user) => user.user.email);
      const emails = [...usersEmail, currentUser.email].join(', ');

      const message = `<img src=${wish.image} alt='Подарок' style='width:100%; object-fit:cover;'>
                      <p>Добрый день! Собрана необходимая сумма на подарок: ${wish.name}</p>
                      <p>Список почт всех, кто скилулся: ${emails}</p>`;
      await this.emailSenderService.sendEmail(emails, message);
    }
    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find({
      relations: {
        item: {
          owner: true,
          offers: true,
        },
        user: {
          wishes: true,
          wishlists: true,
          offers: true,
        },
      },
    });
  }

  async findAllForWishes(id: number): Promise<Offer[]> {
    return this.offerRepository.find({
      relations: {
        item: {
          owner: true,
          offers: true,
        },
        user: {
          wishes: {
            owner: true,
            offers: true,
          },
          offers: true,
          wishlists: {
            owner: true,
            items: true,
          },
        },
      },
      where: {
        item: {
          id: id,
        },
      },
    });
  }

  async findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOneBy({ id });
  }
}
