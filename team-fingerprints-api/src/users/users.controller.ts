import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleType } from 'team-fingerprints-common';
import { UsersService } from './users.service';
import { CreateUserDto, Profile, UpdateUserDto } from './dto/user.dto';
import { Roles } from 'src/role/decorators/roles.decorator';
import { EmailDto } from 'src/company/dto/company.dto';
import { UserDetail, UserProfile } from 'team-fingerprints-common';
import { UserModel } from './models/user.model';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'Current user',
    type: UserModel,
  })
  @Get()
  async getUser(
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<UserModel> {
    return await this.userService.getUserById(userId);
  }

  @ApiResponse({
    status: 200,
    description: 'All users',
    type: [UserModel],
  })
  @Get('/all')
  @Roles([RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async getUsersAll(): Promise<UserModel[]> {
    return await this.userService.getUsersAll();
  }

  @ApiBody({
    description: `Pass array of users ids`,
    type: [String],
  })
  @ApiResponse({
    status: 201,
    description: 'Users profiles by users ids',
    type: [Profile],
  })
  @Post('/profiles')
  @Roles([RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async getUsersByIds(@Body() userIds: string[]): Promise<UserProfile[]> {
    return await this.userService.getUsersByIds(userIds);
  }

  @ApiBody({
    description: `Pass user id`,
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: 'User details by user id',
    type: Profile,
  })
  @Post('/details')
  async setUserDetails(
    @CurrentUserId(ValidateObjectId) userId: string,
    @Body() userDetais: UserDetail,
  ): Promise<UserProfile> {
    return await this.userService.setUserDetails(userId, userDetais);
  }

  @ApiBody({
    description: 'Pass data to create user',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Created user',
    type: UserModel,
  })
  @Post()
  async createUser(@Body() newUserData: CreateUserDto): Promise<UserModel> {
    return await this.userService.createUser(newUserData);
  }

  @ApiBody({
    description: 'Pass data to update user',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Updated user',
    type: UserModel,
  })
  @Patch()
  async updateUser(
    @CurrentUserId(ValidateObjectId) userId: string,
    @Body() updateUserData: UpdateUserDto,
  ): Promise<UserModel> {
    return await this.userService.updateUser(userId, updateUserData);
  }

  @ApiBody({
    description: 'Pass email that needs to be removed',
    type: EmailDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Removed user',
    type: UserModel,
  })
  @Delete()
  @Roles([RoleType.SUPER_ADMIN])
  async removeUserByEmail(@Body() { email }: EmailDto): Promise<UserModel> {
    return await this.userService.removeUserByEmail(email);
  }
}
