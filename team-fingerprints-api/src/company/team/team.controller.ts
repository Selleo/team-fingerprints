import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleType } from 'team-fingerprints-common';
import { CompanyModel } from '../models/company.model';
import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
import { TeamMembersService } from './team-members.service';
import { CompanyMembersService } from '../company-members.service';
import { ValidateEmail } from '../dto/company.dto';
import { Roles } from 'src/role/decorators/roles.decorator';

@ApiTags('teams')
@Controller({ version: '1' })
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly teamMembersService: TeamMembersService,
    private readonly companyMembersService: CompanyMembersService,
  ) {}

  @Get()
  @Roles([RoleType.COMPANY_ADMIN])
  async getTeamsAll(
    @Param('companyId', ValidateObjectId) companyId: string,
  ): Promise<CompanyModel[]> {
    return await this.teamService.getTeamsAll(companyId);
  }

  @Get('/:teamId')
  @Roles([RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER, RoleType.USER])
  async getTeamById(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
  ) {
    return await this.teamService.getTeamById(companyId, teamId);
  }

  @Post('/')
  @Roles([RoleType.COMPANY_ADMIN])
  async createTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() teamDto: CreateTeamDto,
  ): Promise<CompanyModel> {
    return await this.teamService.createTeam(companyId, teamDto);
  }

  @Patch('/:teamId')
  @Roles([RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async updateTeam(
    @Param('teamId', ValidateObjectId) teamId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() teamDto: UpdateTeamDto,
  ): Promise<CompanyModel> {
    return await this.teamService.updateTeam(companyId, teamId, teamDto);
  }

  @Delete('/:teamId')
  @Roles([RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async removeTeam(
    @Param('teamId', ValidateObjectId) teamId: string,
  ): Promise<CompanyModel | HttpException> {
    return await this.teamService.removeTeam(teamId);
  }

  @Post('/:teamId/member')
  @Roles([RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async addUserToTeamWhitelist(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body('emails') emails: string[],
  ) {
    await this.companyMembersService.addUsersToCompanyWhitelist(
      emails,
      companyId,
    );
    return await this.teamMembersService.addUsersToTeamWhitelist(
      companyId,
      teamId,
      emails,
    );
  }

  @Delete('/:teamId/member')
  @Roles([RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async removeMemberFromTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body() { email: memberEmail }: ValidateEmail,
  ) {
    return await this.teamMembersService.removeMemberFromTeam(
      companyId,
      teamId,
      memberEmail,
    );
  }

  @Post('/:teamId/leader')
  @Roles([RoleType.COMPANY_ADMIN])
  async assignTeamLeader(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body() { email }: ValidateEmail,
  ) {
    return await this.teamMembersService.assignTeamLeader(
      companyId,
      teamId,
      email,
    );
  }

  @Delete('/:teamId/leader')
  @Roles([RoleType.COMPANY_ADMIN])
  async removeTeamLeader(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body() { email }: ValidateEmail,
  ) {
    return await this.teamMembersService.removeTeamLeader(email, teamId);
  }
}
