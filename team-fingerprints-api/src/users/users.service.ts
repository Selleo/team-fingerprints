import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PrivilegeI } from 'src/auth/interfaces/auth.interface';
import { CompanyService } from 'src/company/company.service';
import { TeamService } from 'src/company/team/team.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './models/user.model';
import * as mongoose from 'mongoose';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/models/role.model';

import { FilterService } from 'src/filter/filter.service';
import { SurveyFiltersService } from 'src/survey-filters/survey-filters.service';
// import { SurveyCompleteStatus } from 'team-fingerprints-common/enums';
// import {
//   UserProfileI,
//   UserDetailI,
//   UserSurveyAnswerI,
// } from 'team-fingerprints-common/types';
import {
  UserProfileI,
  UserDetailI,
  SurveyCompleteStatus,
  UserSurveyAnswerI,
} from 'team-fingerprints-common';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly companyService: CompanyService,
    private readonly teamService: TeamService,
    private readonly roleService: RoleService,
    private readonly filterService: FilterService,
    private readonly surveyFiltersService: SurveyFiltersService,
  ) {}

  async getUserById(userId: string): Promise<User> {
    return await this.userModel.findOne({ _id: userId });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async getUserByAuthId(authId: string): Promise<User> {
    return await this.userModel.findOne({ authId });
  }

  async prepareUserDetailsQuery(queries: any) {
    const paths = Object.keys(queries);
    if (paths.length <= 0) return;

    const query = [];
    paths.forEach((path) => {
      if (Array.isArray(queries[path])) {
        query[`userDetails.${path}`] = {
          $in: queries[path],
        };
      } else {
        query[`userDetails.${path}`] = queries[path];
      }
    });

    return query;
  }

  async getUsersAll(): Promise<User[]> {
    return await this.userModel.find({});
  }

  async getUsersByIds(userIds: string[]): Promise<UserProfileI[]> {
    if (!userIds || userIds.length <= 0) return [];

    const profiles = userIds?.map(async (id) => {
      if (!Types.ObjectId.isValid(id)) return;
      const profile = await this.getUserProfile(id);
      if (profile) return profile;
    });
    return await Promise.all(profiles);
  }

  async getUsersIdsByUserDetails(usersIds: string[], queries: any = {}) {
    if (Object.keys(queries).length <= 0) return usersIds;

    const ids = usersIds.map((id) => new Types.ObjectId(id));
    const query = await this.prepareUserDetailsQuery(queries);

    const users = await this.userModel.aggregate([
      {
        $match: {
          $and: [
            { _id: { $in: ids } },
            {
              ...query,
            },
          ],
        },
      },
    ]);

    return users.map((user) => user._id.toString());
  }

  async getUserProfile(userId: string): Promise<UserProfileI> {
    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException('User does not exist');

    const profile: UserProfileI = {
      _id: userId,
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
          if (company?._id) {
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
    await this.filterService.validateUserDetails(userDetails);

    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException('User does not exist');

    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { userDetails } },
      { new: true },
    );

    const finishedSurveysIds = (
      await this.userModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(userId),
          },
        },
        {
          $project: {
            surveysAnswers: 1,
          },
        },
        {
          $unwind: '$surveysAnswers',
        },
        {
          $match: {
            'surveysAnswers.completeStatus': SurveyCompleteStatus.FINISHED,
          },
        },
      ])
    ).map((survey) => survey.surveysAnswers.surveyId);

    await this.surveyFiltersService.updateGlobalAvailableFiltersWhenUserChangeUserDetails(
      finishedSurveysIds,
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
    const surveys: boolean[] = surveysAnswers
      .map(
        (el: UserSurveyAnswerI) =>
          el.completeStatus === SurveyCompleteStatus.FINISHED,
      )
      .filter(Boolean);

    if (!surveys || surveys.length <= 0) {
      return await this.userModel
        .findByIdAndRemove(user._id, { new: true })
        .exec();
    }

    return await this.userModel
      .findByIdAndUpdate(user._id, user, { new: true })
      .exec();
  }
}
