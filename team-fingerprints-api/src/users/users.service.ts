import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrivilegeI, UserProfileI } from 'src/auth/interfaces/auth.interface';
import { CompanyService } from 'src/company/company.service';
import { TeamService } from 'src/company/team/team.service';
import { RoleType } from 'src/role/role.type';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './models/user.model';
import * as mongoose from 'mongoose';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/models/role.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly User: Model<User>,
    private readonly companyService: CompanyService,
    private readonly teamService: TeamService,
    private readonly roleService: RoleService,
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
    const profile: UserProfileI = {
      id: user._id,
      email: user.email,
      privileges: [],
    };
    const privileges: PrivilegeI[] = [];

    const roleDocuments: Role[] = await this.roleService.findAllRoleDocuments({
      userId: user._id,
    });

    if (!roleDocuments || roleDocuments.length <= 0)
      throw new UnauthorizedException();

    roleDocuments.forEach(async (roleDocument: Role) => {
      let privilege: PrivilegeI = {
        role: roleDocument.role,
        canCreateCompany: false,
      };

      if (roleDocument.companyId) {
        const company = await this.companyService.getCompanyByUserEmail(
          user.email,
        );
        privilege = {
          ...privilege,
          company: {
            _id: company?._id,
            name: company?.name,
            description: company?.description,
          },
        };
      }

      if (roleDocument.teamId) {
        const team = await this.teamService.getTeamByUserEmail(user.email);
        privilege = {
          ...privilege,
          team: {
            _id: team?._id,
            name: team?.name,
            description: team?.description,
          },
        };
      }

      if (
        !privilege.company &&
        !privilege.team &&
        roleDocument.role === RoleType.USER
      ) {
        privilege = { ...privilege, canCreateCompany: true };
      }

      privileges.push(privilege);
    });
    console.log({ ...profile, privileges });
    return { ...profile, privileges };
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
