import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/common/decorators/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { UserRole } from 'src/users/user.type';
import { CreateTeamDto } from './dto/CreateTeamDto.dto';
import { UpdateTeamDto } from './dto/UpdateTeamDto.dto';
import { TeamService } from './team.service';

@ApiTags('teams')
@Controller({ version: '1' })
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN, UserRole.TEAM_LEADER]))
  async getTeamsAll() {
    return await this.teamService.getTeamsAll();
  }

  @Get('/:teamId')
  async getTeam(@Param('teamId', ValidateObjectId) teamId: string) {
    return await this.teamService.getTeam(teamId);
  }

  @Post('/')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async createTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() body: CreateTeamDto,
  ) {
    return await this.teamService.createTeam(companyId, body);
  }

  @Patch('/:teamId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN, UserRole.TEAM_LEADER]))
  async updateTeam(
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body() body: UpdateTeamDto,
  ) {
    return await this.teamService.updateTeam(teamId, body);
  }

  @Delete('/:teamId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async removeTeam(@Param('teamId', ValidateObjectId) teamId: string) {
    return await this.teamService.removeTeam(teamId);
  }
}
