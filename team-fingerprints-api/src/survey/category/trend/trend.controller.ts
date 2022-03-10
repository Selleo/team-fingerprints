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
import { RoleGuard } from 'src/role/role.guard';
import { RoleType } from 'src/role/role.type';
import { Survey } from 'src/survey/models/survey.model';
import { TrendService } from './trend.service';
import {
  TrendParamsDto,
  CreateTrendDto,
  UpdateTrendDto,
} from './dto/trend.dto';

@ApiTags('trends')
@Controller({ version: '1' })
export class TrendController {
  constructor(private readonly trendService: TrendService) {}

  @Post('/')
  @UseGuards(RoleGuard([RoleType.SUPER_ADMIN]))
  async createTrend(
    @Param() params: TrendParamsDto,
    @Body() trendDto: CreateTrendDto,
  ): Promise<Survey> {
    return await this.trendService.createTrend(params, trendDto);
  }

  @Patch('/:trendId')
  @UseGuards(RoleGuard([RoleType.SUPER_ADMIN]))
  async updateTrend(
    @Param() params: TrendParamsDto,
    @Body() trendDto: UpdateTrendDto,
  ): Promise<Survey> {
    return await this.trendService.updateTrend(params, trendDto);
  }

  @Delete('/:trendId')
  @UseGuards(RoleGuard([RoleType.SUPER_ADMIN]))
  async removeTrend(@Param() params: TrendParamsDto) {
    return this.trendService.removeTrend(params);
  }
}
