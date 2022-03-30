import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrivilegeI, UserProfileI } from 'src/auth/interfaces/auth.interface';
import { CompanyService } from 'src/company/company.service';
import { TeamService } from 'src/company/team/team.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './models/user.model';
import * as mongoose from 'mongoose';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/models/role.model';
import { UserDetailI, UserSurveyAnswerI } from './interfaces/user.interface';
import { FilterService } from 'src/filter/filter.service';
import { SurveyCompleteStatus } from 'src/survey-answer/survey-answer.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly companyService: CompanyService,
    private readonly teamService: TeamService,
    private readonly roleService: RoleService,
    private readonly filterService: FilterService,
  ) {}

  async getUserByAuthId(authId: string): Promise<User> {
    return await this.userModel.findOne({ authId });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async getUser(userId: string): Promise<User> {
    return await this.userModel.findOne({ _id: userId });
  }

  async getUsersAll(): Promise<User[]> {
    return await this.userModel.find({});
  }

  async getUserByUserDetails(_id: string, queries: any) {
    const paths = Object.keys(queries);
    if (paths.length <= 0) return;

    const query = [];
    paths.forEach((path) => {
      query[`userDetails.${path}`] = queries[path];
    });

    return await this.userModel.findOne({
      _id,
      ...query,
    });
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
      userDetails: user.userDetails,
      privileges: [],
    };

    const roleDocuments: Role[] = await this.roleService.findAllRoleDocuments({
      userId: user._id,
    });

    const privileges = await Promise.all(
      roleDocuments.map(async (roleDocument: Role) => {
        let privilege: PrivilegeI = {
          role: roleDocument.role,
          roleId: roleDocument._id,
        };

        if (roleDocument.companyId) {
          const company = await this.companyService.getCompanyById(
            roleDocument.companyId,
          );
          if (company?.id) {
            privilege = {
              ...privilege,
              company: {
                _id: company?._id,
                name: company?.name,
                description: company?.description,
                pointShape: company?.pointShape,
                pointColor: company?.pointColor,
              },
            };
          } else {
            privilege = {
              ...privilege,
              company: null,
            };
          }
        }

        if (roleDocument.teamId) {
          const team = await this.teamService.getTeam(
            roleDocument.companyId,
            roleDocument.teamId,
          );
          if (!team) privilege = { ...privilege, team: null };
          if (team) {
            privilege = {
              ...privilege,
              team: {
                _id: team?._id,
                name: team?.name,
                description: team?.description,
                pointShape: team.pointShape,
                pointColor: team.pointColor,
              },
            };
          }
        }
        return privilege;
      }),
    );
    return { ...profile, privileges };
  }

  async createUser(newUserData: CreateUserDto): Promise<User> {
    const user = await this.userModel.create(newUserData);
    return await user.save();
  }

  async setUserDetails(userId: string, userDetails: UserDetailI) {
    const filterPaths = Object.keys(userDetails);
    if (filterPaths.length <= 0)
      throw new NotFoundException('No params passed');

    const filters = (
      await Promise.all(
        filterPaths.map(async (key) => {
          const filterExists = await this.filterService.getFilterByFilterPath(
            key,
          );
          const filterValue = filterExists.values.find(
            (el) => el._id.toString() === userDetails[key],
          );
          if (!filterValue) return null;
          return filterExists;
        }),
      )
    ).filter(Boolean);

    if (filterPaths.length !== filters.length)
      throw new NotFoundException('Filter not found');

    const user = await this.getUser(userId);
    if (!user) throw new NotFoundException();

    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { userDetails } },
      { new: true },
    );
    return await this.getUserProfile(userId);
  }

  async updateUser(
    userId: string,
    updateUserData: UpdateUserDto,
  ): Promise<User> {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: updateUserData },
      { new: true },
    );
  }

  async userInCompany(userId: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          inCompany: true,
        },
      },
      { new: true },
    );
  }

  async removeUserByEmail(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) throw new NotFoundException('User does not exist');

    user.email = new mongoose.Types.ObjectId().toString();
    user.pictureUrl = '';
    user.lastName = '';
    user.firstName = '';
    user.authId = '';

    const roleDocuments = await this.roleService.findAllRoleDocuments({
      email,
    });

    await Promise.all(
      roleDocuments.map(async (roleDocument) => {
        return await this.roleService.removeRoleDocumentById(roleDocument);
      }),
    );

    const { surveysAnswers } = user;
    const surveyIds: boolean[] = surveysAnswers
      .map(
        (el: UserSurveyAnswerI) =>
          el.completeStatus === SurveyCompleteStatus.FINISHED,
      )
      .filter(Boolean);

    if (!surveyIds || surveyIds.length <= 0) {
      return await this.userModel
        .findByIdAndRemove(user._id, { new: true })
        .exec();
    }

    return await this.userModel
      .findByIdAndUpdate(user._id, user, { new: true })
      .exec();
  }
}
