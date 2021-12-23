import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CreateTrendDto } from './dto/CreateTrendDto.dto';
import { TrendParamsDto } from './dto/TrendParamsDto.dto';
import { UpdateTrendDto } from './dto/UpdateTrendDto.dto';
import { TrendService } from './trend.service';

@Controller({ version: '1' })
export class TrendController {
  constructor(private readonly trendService: TrendService) {}

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
  async removeTrend(@Param('trendId') trendId: string) {
    return this.trendService.removeTrend(trendId);
  }
}
