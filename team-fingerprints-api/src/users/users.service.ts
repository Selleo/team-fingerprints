import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProfileI } from 'src/auth/interfaces/auth.interface';
import { CompanyService } from 'src/company/company.service';
import { Team } from 'src/company/models/team.model';
import { TeamService } from 'src/company/team/team.service';
import { RoleType } from 'src/role/role.type';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './models/user.model';
import * as mongoose from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly User: Model<User>,
    private readonly companyService: CompanyService,
    private readonly teamService: TeamService,
  ) {}

  async getUserByAuthId(authId: string): Promise<User> {
    return await this.User.findOne({ authId });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.User.findOne({ email });
  }

  async getUser(userId: string): Promise<User> {
    return await this.User.findOne({ _id: userId });
  }

  async getUsersAll(): Promise<User[]> {
    return await this.User.find({});
  }

  async getUsersByIds(userIds: string[]): Promise<UserProfileI[]> {
    if (!userIds || userIds.length <= 0) return [];
    const profiles = userIds?.map(async (id) => {
      if (!mongoose.Types.ObjectId.isValid(id)) return;
      const profile = await this.getUserProfile(id);
      if (profile) return profile;
    });
    return await Promise.all(profiles);
  }

  async getUserProfile(userId: string): Promise<UserProfileI> {
    const user = await this.getUser(userId);
    const company = await this.companyService.getCompanyByUserEmail(user.email);
    const team: Team = await this.teamService.getTeamByUserEmail(user.email);

    const profile: UserProfileI = {
      id: user._id,
      email: user.email,
      role: user.role,
      canCreateTeam: !company && !team && user.role === RoleType.USER,
      company: {
        _id: company?._id,
        name: company?.name,
        description: company?.description,
      },
      team: {
        _id: team?._id,
        name: team?.name,
        description: team?.description,
      },
    };

    return profile;
  }

  async createUser(newUserData: CreateUserDto): Promise<User> {
    const user = await this.User.create(newUserData);
    return await user.save();
  }

  async updateUser(
    userId: string,
    updateUserData: UpdateUserDto,
  ): Promise<User> {
    return await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: updateUserData },
      { new: true },
    );
  }

  async removeUser(userId: string): Promise<User> {
    return await this.User.findOneAndDelete({ _id: userId });
  }
}
