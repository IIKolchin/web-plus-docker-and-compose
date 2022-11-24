import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  MinLength,
  MaxLength,
  IsInt,
  IsString,
  IsDate,
  IsUrl,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column({
    type: 'varchar',
  })
  @IsString()
  @MinLength(1, {
    message: 'Должно быть не менее 1 символа',
  })
  @MaxLength(250, {
    message: 'Должно быть не более 250 символов',
  })
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    default: 0,
  })
  @IsInt()
  price: number;

  @Column({
    default: 0,
  })
  @IsInt()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({
    type: 'varchar',
  })
  @IsString()
  @MinLength(1, {
    message: 'Должно быть не менее 1 символа',
  })
  @MaxLength(1024, {
    message: 'Должно быть не более 1024 символов',
  })
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  @IsInt()
  copied: number;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
