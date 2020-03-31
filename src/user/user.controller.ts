import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Query,
  BadRequestException,
  NotFoundException,
  HttpStatus,
  Delete,
  UsePipes,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegistrationDTO, UserUpdateDTO } from '../models/user.model';
import { User } from '../entities/user.entity';
import { HashPasswordPipe } from '../common/pipes/hash-password.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  async getAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':username')
  async findByUserName(@Param('username') username: string): Promise<User> {
    const users = await this.userService.findByUsername(username);
    if (!users.length) {
      throw new NotFoundException(`User ${username} not found!`);
    }
    return users.pop();
  }
  @UsePipes(HashPasswordPipe)
  @Post('')
  async create(@Body() user: UserRegistrationDTO): Promise<void> {
    const users = await this.userService.findByUsername(user.username);
    if (users.length) {
      throw new ConflictException(`Username ${user.username} already exists`);
    }
    await this.userService.create(user);
    return;
  }
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Body() updatedUser: UserUpdateDTO,
    @Param('id') id: number,
  ): Promise<UserUpdateDTO> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new BadRequestException(`User id:${id} not found`);
    }
    await this.userService.update(id, updatedUser);
    return updatedUser;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new BadRequestException(`User id:${id} not found`);
    }
    await this.userService.delete(id);
  }
}
