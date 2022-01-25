import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/common/decorators/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { Survey } from 'src/survey/entities/survey.entity';
import { UserRole } from 'src/users/user.type';
import { CreateTrendDto } from './dto/CreateTrendDto.dto';
import { TrendParamsDto } from './dto/TrendParamsDto.dto';
import { UpdateTrendDto } from './dto/UpdateTrendDto.dto';
import { TrendService } from './trend.service';

@ApiTags('trends')
@Controller({ version: '1' })
export class TrendController {
  constructor(private readonly trendService: TrendService) {}

  @Post('/')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async createTrend(
    @Param() params: TrendParamsDto,
    @Body() body: CreateTrendDto,
  ): Promise<Survey> {
    return await this.trendService.createTrend(params, body);
  }

  @Patch('/:trendId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async updateTrend(
    @Param() params: TrendParamsDto,
    @Body() body: UpdateTrendDto,
  ): Promise<Survey> {
    return await this.trendService.updateTrend(params, body);
  }

  @Delete('/:trendId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async removeTrend(
    @Param('trendId', ValidateObjectId) trendId: string,
  ): Promise<Survey> {
    return this.trendService.removeTrend(trendId);
  }
}
