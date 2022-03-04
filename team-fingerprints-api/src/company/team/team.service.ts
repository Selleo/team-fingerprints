import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../models/company.model';
import { Team } from '../models/team.model';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Company.name) private readonly teamModel: Model<Company>,
  ) {}

  async getTeamsAll(): Promise<Company[]> {
    return await this.teamModel.find({}, { teams: 1 }).exec();
  }

  async getTeam(teamId: string): Promise<Team | HttpException> {
    const company: Company = await this.teamModel
      .findOne({ 'teams._id': teamId })
      .exec();
    if (!company) throw new NotFoundException();
    const team = company.teams.find(
      (team) => teamId && team?._id?.toString() === teamId?.toString(),
    );
    if (!team) throw new NotFoundException();
    return team;
  }

  async getTeamByUserEmail(email: string): Promise<Team | HttpException> {
    const company: Company = await this.teamModel
      .findOne({ 'teams.emailWhitelist': email }, { teams: 1 })
      .exec();
    if (!company) return;
    const team = company.teams.find((team) =>
      team.emailWhitelist.find((member) => member === email),
    );
    if (!team) return;
    return team;
  }

  async createTeam(companyId: string, team: CreateTeamDto): Promise<Company> {
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
    companyId: string,
    teamId: string,
    { name, description, pointShape, pointColor }: UpdateTeamDto,
  ): Promise<Company> {
    const team = await this.teamModel
      .findOneAndUpdate(
        {
          _id: companyId,
          'teams._id': teamId,
        },
        {
          $set: {
            'teams.$.name': name,
            'teams.$.description': description,
            'teams.$.pointShape': pointShape,
            'teams.$.pointColor': pointColor,
          },
        },
        { new: true },
      )
      .exec();
    return team;
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
}
