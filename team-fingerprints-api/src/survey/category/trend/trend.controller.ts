import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTrendDto } from './dto/CreateTrendDto.dto';
import { TrendParamsDto } from './dto/TrendParamsDto.dto';
import { UpdateTrendDto } from './dto/UpdateTrendDto.dto';
import { TrendService } from './trend.service';

@Controller()
export class TrendController {
  constructor(private readonly trendService: TrendService) {}

  @Get('/')
  async getTrendsAll(@Param() params: TrendParamsDto) {
    return await this.trendService.getTrendsAll(params);
  }

  // @Get('/:trendId')
  // async getTrend(@Param() params: TrendParamsDto) {
  //   return this.trendService.getTrend(params);
  // }

  @Post('/')
  async createTrend(
    @Param() params: TrendParamsDto,
    @Body() body: CreateTrendDto,
  ) {
    return await this.trendService.createTrend(params, body);
  }

  @Patch('/:trendId')
  async updateTrend(
    @Param() params: TrendParamsDto,
    @Body() body: UpdateTrendDto,
  ) {
    return await this.trendService.updateTrend(params, body);
  }

  @Delete('/:trendId')
  async removeTrend(@Param() params: TrendParamsDto) {
    return this.trendService.removeTrend(params);
  }
}
