import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { unlinkSync } from 'fs';
import { isURL, IsUrl } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const createUser = this.usersRepository.create(createUserDto);

    const saveUser = await this.usersRepository.save(createUser);

    return {
      message: 'user created',
      user: saveUser,
    };
  }

  async findAll() {
    const users = await this.usersRepository.find();
    if (!users) {
      throw new NotFoundException('no users founded');
    }
    return {
      length: users.length,
      users,
    };
  }

  async findOne(id: number, payload) {
    console.log(payload.id);
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`no user for ${id} id`);
    }
    if (payload.id !== id) {
      throw new UnauthorizedException(`you cant accsess this data`);
    }
    return {
      user,
    };
  }
  async update(id: number, updateUserDto: UpdateUserDto, payload) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`no user for ${id} id`);
    }
    if (payload.id !== id) {
      throw new UnauthorizedException(`you cant accsess this data`);
    }

    // const updatedUser = { ...user, ...updateUserDto }; //not entity
    this.usersRepository.merge(user, updateUserDto);

    await this.usersRepository.save(user);
    return {
      message: 'user updated sucessfully',
      user,
    };
  }

  async remove(id: number, payload) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`no user for ${id} id`);
    }
      await this.usersRepository.remove(user);
      return {
        message: 'user deleted sucessfully',
      };

   
  }

  async setProfileImage(userId: number, newProfileImage: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException();
    }
    if (user.profileImage===null) {
      user.profileImage = newProfileImage;
    }else{
      await this.removeProfileImage(userId);
      user.profileImage = newProfileImage;
    }
    return this.usersRepository.save(user);


    
  }

  async removeProfileImage(userid: number) {
    const user = await this.usersRepository.findOne({ where: { id: userid } });
    if(!user){throw new NotFoundException()}
    if (user?.profileImage===null) {
      throw new BadRequestException('no image to delete')
    }

   
    const imagePath = join(
      process.cwd(),
      `./images/users/${user?.profileImage}`,
    );
    
    unlinkSync(imagePath);
    user.profileImage=''
    return await this.usersRepository.save(user);
  }
}
