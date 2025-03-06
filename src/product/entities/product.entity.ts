import { Review } from 'src/review/entities/review.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;
  @Column({ nullable: false })
  description: string;
  @Column({ nullable: false })
  price: number;

  @Column({
    default:
      'https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png',
  })
  image: string;

  @Column({ default: '' })
  public_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}
