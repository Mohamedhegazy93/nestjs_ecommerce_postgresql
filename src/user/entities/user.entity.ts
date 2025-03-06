import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  Unique,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/guards/roles.enum';
import { Exclude } from 'class-transformer';
import { Review } from 'src/review/entities/review.entity';

@Entity()
@Unique(['userName'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  userName: string;
  @Column({ nullable: false, unique: true })
  email: string;
  @Exclude()
  @Column({ nullable: false })
  password: string;


  @Column({ default: '' })
  public_id: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Column({ default: false })
  isAccountVerfied: boolean;

  @Column({ default: '' })
  bio: string;

  @Column({ nullable: false })
  nationality: string;

  @CreateDateColumn({ type:'timestamp'})
  createdAt: Date;

  @Column({ nullable: true,})
  profileImage:string
  @OneToMany(()=>Review,(review)=>review.user)
  reviews:Review[]

  //Hash Password before insert to DB
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password,this.password);
  }
}
