import { Injectable, HttpException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository, InsertResult, DeleteResult, UpdateResult } from 'typeorm';
import { UserRegistrationDTO, UserUpdateDTO } from 'src/models/user.model';
import { Observable } from 'rxjs';
@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  findByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { username } });
  }
  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }
  findOne(id: number): Promise<UserEntity> {
    return this.userRepository.findOneOrFail(id);
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
  create(user: UserRegistrationDTO): Promise<InsertResult> {
    const _user = this.userRepository.create(user);
    return this.userRepository.insert(user);
  }

  async update(id, user: UserUpdateDTO): Promise<UpdateResult> {
    return this.userRepository.update({ id }, user);
  }
  async delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
