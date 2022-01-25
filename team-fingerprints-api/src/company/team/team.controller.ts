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
import { RoleGuard } from 'src/common/decorators/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { UserRole } from 'src/users/user.type';
import { Company } from '../entities/Company.entity';
import { Team } from '../entities/team.entity';
import { CreateTeamDto } from './dto/CreateTeamDto.dto';
import { UpdateTeamDto } from './dto/UpdateTeamDto.dto';
import { TeamService } from './team.service';

@ApiTags('teams')
@Controller({ version: '1' })
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN, UserRole.TEAM_LEADER]))
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
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async createTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() body: CreateTeamDto,
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<Company> {
    return await this.teamService.createTeam(userId, companyId, body);
  }

  @Patch('/:teamId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN, UserRole.TEAM_LEADER]))
  async updateTeam(
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body() body: UpdateTeamDto,
  ): Promise<Company> {
    return await this.teamService.updateTeam(teamId, body);
  }

  @Post('/:teamId/leader')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN, UserRole.TEAM_LEADER]))
  async assignTeamLeader(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @CurrentUserId(ValidateObjectId) userId: string,
    @Body('email') email: string,
    @Body('isTeamMember') isTeamMember: boolean,
  ): Promise<Company | HttpException> {
    return await this.teamService.assignTeamLeader(
      companyId,
      teamId,
      email,
      isTeamMember,
    );
  }

  @Post('/:teamId/member')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN, UserRole.TEAM_LEADER]))
  async addMemberToTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body('email') email: string,
  ): Promise<Company | HttpException> {
    return await this.teamService.addMemberToTeam(companyId, teamId, email);
  }

  @Delete('/:teamId/member')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN, UserRole.TEAM_LEADER]))
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
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async removeTeam(
    @Param('teamId', ValidateObjectId) teamId: string,
  ): Promise<Company | HttpException> {
    return await this.teamService.removeTeam(teamId);
  }
}
