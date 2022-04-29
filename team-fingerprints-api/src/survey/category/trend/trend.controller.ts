import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleType } from 'team-fingerprints-common';
import { Survey } from 'src/survey/models/survey.model';
import { TrendService } from './trend.service';
import {
  TrendParamsDto,
  CreateTrendDto,
  UpdateTrendDto,
} from './dto/trend.dto';
import { Roles } from 'src/role/decorators/roles.decorator';

@ApiTags('trends')
@Controller({ version: '1' })
export class TrendController {
  constructor(private readonly trendService: TrendService) {}

  @Post()
  @Roles([RoleType.SUPER_ADMIN])
  async createTrend(
    @Param() params: TrendParamsDto,
    @Body() trendDto: CreateTrendDto,
  ): Promise<Survey> {
    return await this.trendService.createTrend(params, trendDto);
  }

  @Patch('/:trendId')
  @Roles([RoleType.SUPER_ADMIN])
  async updateTrend(
    @Param() params: TrendParamsDto,
    @Body() trendDto: UpdateTrendDto,
  ): Promise<Survey> {
    return await this.trendService.updateTrend(params, trendDto);
  }

  @Delete('/:trendId')
  @Roles([RoleType.SUPER_ADMIN])
  async removeTrend(@Param() params: TrendParamsDto) {
    return this.trendService.removeTrend(params);
  }
}
