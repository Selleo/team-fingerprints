import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleType, User } from 'team-fingerprints-common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Roles } from 'src/role/decorators/roles.decorator';
import { ValidateEmail } from 'src/company/dto/company.dto';
import { UserDetail, UserProfile } from 'team-fingerprints-common';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUser(
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<User> {
    return await this.userService.getUserById(userId);
  }

  @Get('/all')
  @Roles([RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async getUsersAll(): Promise<User[]> {
    return await this.userService.getUsersAll();
  }

  @Post('/profiles')
  @Roles([RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async getUsersByIds(@Body() userIds: string[]): Promise<UserProfile[]> {
    return await this.userService.getUsersByIds(userIds);
  }

  @Post('/details')
  async setUserDetails(
    @CurrentUserId(ValidateObjectId) userId: string,
    @Body() userDetais: UserDetail,
  ): Promise<UserProfile> {
    return await this.userService.setUserDetails(userId, userDetais);
  }

  @Post()
  async createUser(@Body() newUserData: CreateUserDto): Promise<User> {
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
  @Roles([RoleType.SUPER_ADMIN])
  async removeUserByEmail(@Body() { email }: ValidateEmail): Promise<User> {
    return await this.userService.removeUserByEmail(email);
  }
}
