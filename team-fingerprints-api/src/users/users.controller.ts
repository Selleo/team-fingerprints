import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { RoleGuard } from 'src/common/decorators/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { User } from './entities/user.entity';
import { UserRole } from './user.type';
import { UsersService } from './users.service';

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
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async getUsersAll(
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<User[]> {
    return await this.userService.getUsersAll();
  }

  @Post()
  async createUser(@Body() newUserData: CreateUserDto): Promise<User> {
    return await this.userService.createUser(newUserData);
  }

  @Patch()
  async updateUser(
    @CurrentUserId(ValidateObjectId) userId: string,
    @Body() updateUserData: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userId, updateUserData);
  }

  @Delete()
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async removeUser(@CurrentUserId(ValidateObjectId) userId: string) {
    return await this.userService.removeUser(userId);
  }

  @UseGuards(RoleGuard())
  async changeUserRole(
    @CurrentUserId(ValidateObjectId) userId: string,
    @Body() role: UserRole,
  ) {
    return await this.userService.changeUserRole(userId, role);
  }
}
