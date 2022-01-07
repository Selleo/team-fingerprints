import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { CreateTeamDto } from './dto/CreateTeamDto.dto';
import { UpdateTeamDto } from './dto/UpdateTeamDto.dto';
import { TeamService } from './team.service';

@ApiTags('teams')
@Controller({ version: '1' })
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
  @Get()
  async getTeamsAll() {
    return await this.teamService.getTeamsAll();
  }

  @Get('/:teamId')
  async getTeam(@Param('teamId', ValidateObjectId) teamId: string) {
    return await this.teamService.getTeam(teamId);
  }

  @Post('/')
  async createTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() body: CreateTeamDto,
  ) {
    return await this.teamService.createTeam(companyId, body);
  }

  @Patch('/:teamId')
  async updateTeam(
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body() body: UpdateTeamDto,
  ) {
    return await this.teamService.updateTeam(teamId, body);
  }

  @Delete('/:teamId')
  async removeTeam(@Param('teamId', ValidateObjectId) teamId: string) {
    return await this.teamService.removeTeam(teamId);
  }
}
