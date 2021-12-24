import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { UserSurveyResponseDto } from './dto/UserSurveyResponseDto.dto ';
import { User } from './entities/user.entity';
import { UserRole } from './Roles/UserRoles.enum';
import { UsersService } from './users.service';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/:userId')
  async getUser(@Param('userId') userId: string): Promise<User> {
    return await this.userService.getUser(userId);
  }

  @Get('/')
  async getUsersAll(): Promise<User[]> {
    return await this.userService.getUsersAll();
  }

  @Post('/')
  async createUser(@Body() newUserData: CreateUserDto): Promise<User> {
    return await this.userService.createUser(newUserData);
  }

  @Patch('/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserData: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userId, updateUserData);
  }

  @Delete('/:userId')
  async removeUser(@Param('userId') userId: string) {
    return await this.userService.removeUser(userId);
  }

  @Patch('/:userId')
  async changeRole(
    @Param('userId') userId: string,
    @Body('role') role: UserRole,
  ) {
    return await this.userService.changeRole(userId, role);
  }

  @Post('/:userId')
  async saveUsersSurveyRespone(
    @Param('userId') userId: string,
    @Body() surveyResponseData: UserSurveyResponseDto,
  ) {
    return await this.userService.saveUsersSurveyRespone(
      userId,
      surveyResponseData,
    );
  }
}
