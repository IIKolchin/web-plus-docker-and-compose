import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { WishesModule } from '../wishes/wishes.module';
import { EmailSenderModule } from '../email-sender/email-sender.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    WishesModule,
    EmailSenderModule,
    UsersModule,
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
