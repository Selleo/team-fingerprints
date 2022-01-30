import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { Role } from 'src/role/role.type';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUser(
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<User> {
    return await this.userService.getUser(userId);
  }

  @Get()
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  async getUsersAll(): Promise<User[]> {
    return await this.userService.getUsersAll();
  }

  @Post()
  async createUser(
    @Body() newUserData: CreateUserDto,
  ): Promise<User | HttpException> {
    return await this.userService.createUser(newUserData);
  }

  @Patch()
  async updateUser(
    @CurrentUserId(ValidateObjectId) userId: string,
    @Body() updateUserData: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(userId, updateUserData);
  }

  @Delete()
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  async removeUser(
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<User> {
    return await this.userService.removeUser(userId);
  }
}
