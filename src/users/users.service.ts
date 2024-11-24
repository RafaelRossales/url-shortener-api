import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ){}

  async create(createUserDto: CreateUserDto): Promise<UserEntity>  {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll(): Promise<UserEntity[]>  {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity>  {
   return this.userRepository.findOne({ where:{id}});
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where:{id}});
    console.log(user);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where:{id}});
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.deletedAt = new Date();
    await this.userRepository.save(user);
  }
}
