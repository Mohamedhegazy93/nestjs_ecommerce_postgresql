import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Unique, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:false,unique:true})
  userName: string;
  @Column({nullable:false,unique:true})
  email: string;

  @Column({nullable:false})
  @Exclude() 
  password: string;

  @Column({default:'https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png'})
  profilePhotoUrl: string;

  @Column({default:''})
  public_id: string;

  @Column({ default: false })
  @Exclude()
  isAdmin: boolean;

  @Column({ default: false })
  isAccountVerfied: boolean;

  @Column({default:''})
  bio: string;

  @Column({nullable:false})
  nationality: string;
  @Column({default:''})
  token: string;

  //Hash Password before insert to DB
  @BeforeInsert()
  async hashPassword() {
    if (this.password) { 
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

}