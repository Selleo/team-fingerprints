import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../entities/Company.entity';
import { CreateTeamDto } from './dto/CreateTeamDto.dto';
import { UpdateTeamDto } from './dto/UpdateTeamDto.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Company.name) private readonly teamModel: Model<Company>,
  ) {}

  async getTeamsAll() {
    return await this.teamModel.find({}, { teams: 1 }).exec();
  }

  async getTeam(teamId: string) {
    return await this.teamModel
      .findOne({ 'teams._id': teamId }, { teams: 1 })
      .exec();
  }

  async createTeam(companyId: string, team: CreateTeamDto) {
    return await this.teamModel.updateOne(
      { _id: companyId },
      {
        $push: {
          teams: team,
        },
      },
    );
  }

  async updateTeam(
    teamId: string,
    { name, description, members, emailWhitelist, teamLeader }: UpdateTeamDto,
  ) {
    return await this.teamModel
      .updateOne(
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
      )
      .exec();
  }

  async removeTeam(teamId: string) {
    return await this.teamModel
      .updateOne(
        { 'teams._id': teamId },
        {
          $pull: {
            teams: { _id: teamId },
          },
        },
      )
      .exec();
  }
}
