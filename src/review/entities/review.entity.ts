import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  comment: string;
  @Column({ nullable: false })
  rating: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(()=>Product,(product)=>product.reviews,{onDelete:'CASCADE'})
  product: Product;

@ManyToOne(()=>User,(user)=>user.reviews,{onDelete:'CASCADE'})
  user:User
}
