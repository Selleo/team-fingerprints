import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/role/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { Role } from 'src/role/role.type';
import { Company } from '../models/company.model';
import { Team } from '../models/team.model';
import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
import { TeamMembersService } from './team-members.service';
import { CompanyMembersService } from '../company-members.service';
import { ValidateEmail } from '../dto/company.dto';

@ApiTags('teams')
@Controller({ version: '1' })
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly teamMembersService: TeamMembersService,
    private readonly companyMembersService: CompanyMembersService,
  ) {}

  @Get()
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  async getTeamsAll(): Promise<Company[]> {
    return await this.teamService.getTeamsAll();
  }

  @Get('/:teamId')
  async getTeam(
    @Param('teamId', ValidateObjectId) teamId: string,
  ): Promise<Team | HttpException> {
    return await this.teamService.getTeam(teamId);
  }

  @Post('/')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN], false))
  async createTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() teamDto: CreateTeamDto,
  ): Promise<Company> {
    return await this.teamService.createTeam(companyId, teamDto);
  }

  @Patch('/:teamId')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN, Role.TEAM_LEADER], false))
  async updateTeam(
    @Param('teamId', ValidateObjectId) teamId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() teamDto: UpdateTeamDto,
  ): Promise<Company> {
    return await this.teamService.updateTeam(companyId, teamId, teamDto);
  }

  @Delete('/:teamId')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN], false))
  async removeTeam(
    @Param('teamId', ValidateObjectId) teamId: string,
  ): Promise<Company | HttpException> {
    return await this.teamService.removeTeam(teamId);
  }

  @Post('/:teamId/member')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN, Role.TEAM_LEADER], false))
  async addUserToTeamWhitelist(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body() { email }: ValidateEmail,
  ): Promise<Company | HttpException> {
    await this.companyMembersService.addUserToCompanyWhitelist(
      companyId,
      email,
    );
    return await this.teamMembersService.addUserToTeamWhitelist(
      companyId,
      teamId,
      email,
    );
  }

  @Delete('/:teamId/member')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN, Role.TEAM_LEADER], false))
  async removeMemberFromTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body() { email: memberEmail }: ValidateEmail,
  ): Promise<Company | HttpException> {
    return await this.teamMembersService.removeMemberFromTeam(
      companyId,
      teamId,
      memberEmail as unknown as string,
    );
  }

  @Post('/:teamId/leader')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN], false))
  async assignTeamLeader(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body() { email }: ValidateEmail,
  ): Promise<Company | HttpException> {
    return await this.teamMembersService.assignTeamLeader(
      companyId,
      teamId,
      email,
    );
  }

  @Delete('/:teamId/leader')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN], false))
  async removeTeamLeader(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body() { email }: ValidateEmail,
  ): Promise<Company | HttpException> {
    return await this.teamMembersService.removeTeamLeaderByEmail(
      email,
      teamId,
      companyId,
    );
  }
}
