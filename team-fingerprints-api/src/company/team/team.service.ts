import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleService } from 'src/role/role.service';
import { Company } from '../models/company.model';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private readonly roleService: RoleService,
  ) {}

  async getTeamsAll(companyId): Promise<Company[]> {
    return await this.companyModel
      .find({ _id: companyId }, { teams: 1 })
      .exec();
  }

  async getTeamById(companyId: string, teamId: string) {
    const company: Company = await this.companyModel
      .findOne({ _id: companyId, 'teams._id': teamId })
      .exec();

    if (!company) throw new NotFoundException();
    const team = company.teams.find(
      (team) => team?._id?.toString() === teamId?.toString(),
    );

    const roleDocuments = await this.roleService.findAllRoleDocuments({
      companyId,
      teamId,
    });

    if (!roleDocuments) return team;

    return { team, roles: roleDocuments };
  }

  async getTeam(companyId: string, teamId: string) {
    const company: Company = await this.companyModel
      .findOne({ _id: companyId, 'teams._id': teamId })
      .exec();

    if (!company) throw new NotFoundException();
    const team = company.teams.find(
      (team) => team?._id?.toString() === teamId?.toString(),
    );

    return team;
  }

  async createTeam(companyId: string, team: CreateTeamDto): Promise<Company> {
    return await this.companyModel
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
    const team = await this.companyModel
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
    const roleDocuments = await this.roleService.findAllRoleDocuments({
      teamId,
    });

    roleDocuments.forEach(async (doc) => {
      await this.roleService.removeRoleDocumentById(doc);
    });

    return await this.companyModel
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
