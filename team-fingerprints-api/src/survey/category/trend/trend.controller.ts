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
import { UpdateTrendDto } from './dto/UpdateTrendDto.dto';
import { TrendService } from './trend.service';

@Controller()
export class TrendController {
  constructor(private readonly trendService: TrendService) {}

  @Get('/:trendId')
  async getTrend(@Param('trendId') trendId: string): Promise<string> {
    return trendId;
  }

  @Post('/')
  async createTrend(@Body() body: CreateTrendDto) {
    return await this.trendService.createTrend(body);
  }

  @Patch('/:trendId')
  async updateTrend(
    @Param('trendId') trendId: string,
    @Body() body: UpdateTrendDto,
  ) {
    return await this.trendService.updateTrend(trendId, body);
  }

  @Delete('/:trendId')
  async removeTrend(@Param('trendId') trendId: string) {
    return this.trendService.removeTrend(trendId);
  }
}
