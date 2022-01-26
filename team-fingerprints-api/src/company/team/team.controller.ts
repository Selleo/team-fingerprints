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
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { Role } from 'src/role/role.type';
import { Company } from '../entities/Company.entity';
import { Team } from '../entities/team.entity';
import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';

@ApiTags('teams')
@Controller({ version: '1' })
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

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
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  async createTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() teamDto: CreateTeamDto,
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<Company> {
    return await this.teamService.createTeam(userId, companyId, teamDto);
  }

  @Patch('/:teamId')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN, Role.TEAM_LEADER]))
  async updateTeam(
    @Param('teamId', ValidateObjectId) teamId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() teamDto: UpdateTeamDto,
  ): Promise<Company> {
    return await this.teamService.updateTeam(companyId, teamId, teamDto);
  }

  @Post('/:teamId/leader')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  async assignTeamLeader(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body('email') email: string,
  ): Promise<Company | HttpException> {
    return await this.teamService.assignTeamLeader(companyId, teamId, email);
  }

  @Post('/:teamId/member')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN, Role.TEAM_LEADER]))
  async addUserToTeamWhitelist(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body('email') email: string,
  ): Promise<Company | HttpException> {
    return await this.teamService.addUserToTeamWhitelist(
      companyId,
      teamId,
      email,
    );
  }

  @Delete('/:teamId/member')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN, Role.TEAM_LEADER]))
  async removeMemberFromTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body('email') memberEmail: string,
  ): Promise<Company | HttpException> {
    return await this.teamService.removeMemberFromTeam(
      companyId,
      teamId,
      memberEmail,
    );
  }

  @Delete('/:teamId')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  async removeTeam(
    @Param('teamId', ValidateObjectId) teamId: string,
  ): Promise<Company | HttpException> {
    return await this.teamService.removeTeam(teamId);
  }
}
