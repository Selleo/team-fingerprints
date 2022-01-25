import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { Company } from '../entities/Company.entity';
import { Team } from '../entities/team.entity';
import { CreateTeamDto } from './dto/CreateTeamDto.dto';
import { UpdateTeamDto } from './dto/UpdateTeamDto.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Company.name) private readonly teamModel: Model<Company>,
    private readonly usersService: UsersService,
  ) {}

  async getTeamsAll() {
    return await this.teamModel.find({}, { teams: 1 }).exec();
  }

  async getTeam(teamId: string): Promise<Team> {
    const teams: Company = await this.teamModel
      .findOne({ 'teams.$': teamId }, { teams: 1 })
      .exec();
    return teams.teams.find(
      (team) => team?._id.toString() === teamId.toString(),
    );
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
    { name, description, members, emailWhitelist, teamLeader }: UpdateTeamDto,
  ): Promise<Company> {
    return await this.teamModel
      .findOneAndUpdate(
        {
          'teams._id': teamId,
        },
        {
          $set: {
            'teams.$.name': name,
            'teams.$.description': description,
            'teams.$.members': members,
            'teams.$.emailWhitelist': emailWhitelist,
            'teams.$.teamLeader': teamLeader,
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
    isTeamMember: boolean,
  ) {
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
    if (!team.members.find((el) => el === leaderCandidateId) && isTeamMember)
      return await this.addMemberToTeam(companyId, teamId, leaderEmail);
    return teamWithLeader;
  }

  async addMemberToTeam(
    companyId: string,
    teamId: string,
    memberEmail: string,
  ) {
    const newMember = await this.usersService.getUserByEmail(memberEmail);
    if (!newMember) return new NotFoundException();

    const newMemberId = newMember?._id.toString();
    const team = await this.getTeam(teamId);
    if (!team) return new NotFoundException();

    if (team.members.find((el) => el === newMemberId))
      return new ForbiddenException();

    const teamWithNewMember = await this.teamModel
      .findOneAndUpdate(
        { _id: companyId, 'teams._id': teamId },
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
  ) {
    const memberToRemove = await this.usersService.getUserByEmail(memberEmail);
    if (!memberToRemove) return new NotFoundException();

    const memberToRemoveId = memberToRemove?._id.toString();
    const team = await this.getTeam(teamId);
    if (!team) return new NotFoundException();

    if (!team.members.find((el) => el === memberToRemoveId))
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
