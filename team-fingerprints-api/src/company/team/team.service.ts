import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { Company } from '../entities/Company.entity';
import { Team } from '../entities/team.entity';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Company.name) private readonly teamModel: Model<Company>,
    private readonly usersService: UsersService,
  ) {}

  async getTeamsAll(): Promise<Company[]> {
    return await this.teamModel.find({}, { teams: 1 }).exec();
  }

  async getTeam(teamId: string): Promise<Team | HttpException> {
    const teams: Company = await this.teamModel
      .findOne({ 'teams.$': teamId }, { teams: 1 })
      .exec();
    const team = teams.teams.find(
      (team) => team?._id.toString() === teamId.toString(),
    );
    if (!team) return new NotFoundException();
    return team;
  }

  async getTeamByUserEmail(email: string): Promise<Team | HttpException> {
    const teams: Company = await this.teamModel
      .findOne({ 'teams.emailWhitelist': email }, { teams: 1 })
      .exec();
    const team = teams.teams.find((team) =>
      team.emailWhitelist.find((member) => member === email),
    );
    if (!team) return new NotFoundException();
    return team;
  }

  async createTeam(
    userId: string,
    companyId: string,
    team: CreateTeamDto,
  ): Promise<Company> {
    return await this.teamModel
      .findOneAndUpdate(
        { _id: companyId },
        {
          $push: {
            teams: team,
          },
        },
        { new: true },
      )
      .exec();
  }

  async updateTeam(
    teamId: string,
    companyId: string,
    { name, description }: UpdateTeamDto,
  ): Promise<Company> {
    return await this.teamModel
      .findOneAndUpdate(
        {
          _id: companyId,
          'teams._id': teamId,
        },
        {
          $set: {
            'teams.$.name': name,
            'teams.$.description': description,
          },
        },
        { new: true },
      )
      .exec();
  }

  async removeTeam(teamId: string): Promise<Company> {
    return await this.teamModel
      .findOneAndUpdate(
        { 'teams._id': teamId },
        {
          $pull: {
            teams: { _id: teamId },
          },
        },
        { new: true },
      )
      .exec();
  }

  async assignTeamLeader(
    companyId: string,
    teamId: string,
    leaderEmail: string,
  ): Promise<Company | HttpException> {
    const leaderCandidate = await this.usersService.getUserByEmail(leaderEmail);
    if (!leaderCandidate) return new NotFoundException();

    const leaderCandidateId = leaderCandidate?._id.toString();
    const team = await this.getTeam(teamId);
    if (!team) return new NotFoundException();

    const teamWithLeader = await this.teamModel
      .findOneAndUpdate(
        { _id: companyId, 'teams._id': teamId },
        {
          $set: {
            'teams.$.teamLeader': leaderCandidateId,
          },
        },
        { new: true },
      )
      .exec();
    if (!teamWithLeader) return new InternalServerErrorException();
    const { members } = team as Team;
    if (!members.includes(leaderCandidateId)) {
      await this.addUserToTeamWhitelist(companyId, teamId, leaderEmail);
      await this.addMemberToTeamByEmail(leaderEmail);
    }

    return teamWithLeader;
  }

  async isUserInAnyTeamWhitelist(
    teamId: string,
    email: string,
  ): Promise<boolean> {
    const team = await this.getTeam(teamId);
    if (!team) return false;
    const { emailWhitelist } = team as Team;

    return emailWhitelist.find((el) => el === email) ? true : false;
  }

  async addUserToTeamWhitelist(
    companyId: string,
    teamId: string,
    email: string,
  ): Promise<Company | HttpException> {
    if (await this.isUserInAnyTeamWhitelist(teamId, email)) {
      return new ForbiddenException(
        `This email already exists in whitelist for chosen team`,
      );
    }

    return await this.teamModel
      .findOneAndUpdate(
        { _id: companyId, 'teams._id': teamId },
        {
          $push: {
            'teams.$.emailWhitelist': email,
          },
        },
        { new: true },
      )
      .exec();
  }

  async addMemberToTeamByEmail(
    email: string,
  ): Promise<Company | HttpException> {
    const team: any = await this.getTeamByUserEmail(email);
    const teamId = team._id.toString();

    if (!(await this.isUserInAnyTeamWhitelist(teamId, email))) {
      return new NotFoundException();
    }

    const newMember = await this.usersService.getUserByEmail(email);
    if (!newMember) return new NotFoundException();

    const newMemberId = newMember?._id.toString();
    if (!team) return new NotFoundException();

    const { members } = team as Team;

    if (members.find((el) => el === newMemberId))
      return new ForbiddenException();

    const teamWithNewMember = await this.teamModel
      .findOneAndUpdate(
        { 'teams._id': teamId },
        {
          $push: {
            'teams.$.members': newMemberId,
          },
        },
        { new: true },
      )
      .exec();
    if (!teamWithNewMember) return new InternalServerErrorException();
    return teamWithNewMember;
  }

  async removeMemberFromTeam(
    companyId: string,
    teamId: string,
    memberEmail: string,
  ): Promise<Company | HttpException> {
    const memberToRemove = await this.usersService.getUserByEmail(memberEmail);
    if (!memberToRemove) return new NotFoundException();

    const memberToRemoveId = memberToRemove?._id.toString();
    const team = await this.getTeam(teamId);
    if (!team) return new NotFoundException();
    const { members } = team as Team;

    if (!members.find((el) => el === memberToRemoveId))
      return new NotFoundException();

    const teamWithoutRemovedMember = await this.teamModel
      .findOneAndUpdate(
        { _id: companyId, 'teams._id': teamId },
        {
          $pull: {
            'teams.$.members': memberToRemoveId,
          },
        },
        { new: true },
      )
      .exec();
    if (!teamWithoutRemovedMember) return new InternalServerErrorException();
    return teamWithoutRemovedMember;
  }
}
