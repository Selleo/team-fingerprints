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
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/role.type';
import {
  CreateDetailDto,
  CreateDetailDtoValue,
  UpdateDetailDto,
  UpdateDetailDtoValue,
} from './dto/user-detail.dto';
import { UserDetailsService } from './user-details.service';

@ApiTags('user-details')
@Controller({ path: 'user-details', version: '1' })
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) {}

  @Get()
  async getUserDetails() {
    return await this.userDetailsService.getUserDetailsList();
  }

  @Get(':detailId')
  async getUserDetail(@Param('detailId', ValidateObjectId) detailId: string) {
    return await this.userDetailsService.getUserDetail(detailId);
  }

  @Post()
  @Roles([RoleType.SUPER_ADMIN])
  async createUserDetial(@Body() { name, savedInUser }: CreateDetailDto) {
    return await this.userDetailsService.createUserDetial(name, savedInUser);
  }

  @Patch(':detailId')
  @Roles([RoleType.SUPER_ADMIN])
  async updateUserDetial(
    @Param('detailId', ValidateObjectId) detailId: string,
    @Body() { name, savedInUser }: UpdateDetailDto,
  ) {
    return await this.userDetailsService.updateUserDetial(
      detailId,
      name,
      savedInUser,
    );
  }

  @Delete(':detailId')
  @Roles([RoleType.SUPER_ADMIN])
  async removeUserDetial(
    @Param('detailId', ValidateObjectId) detailId: string,
  ) {
    return await this.userDetailsService.removeUserDetial(detailId);
  }

  @Get(':detailId/values')
  async getUserDetailWithValues(
    @Param('detailId', ValidateObjectId) detailId: string,
  ) {
    return await this.userDetailsService.getUserDetailWithValues(detailId);
  }

  @Post(':detailId/values')
  @Roles([RoleType.SUPER_ADMIN])
  async addUserDetailValue(
    @Param('detailId', ValidateObjectId) detailId: string,
    @Body() { value }: CreateDetailDtoValue,
  ) {
    return await this.userDetailsService.addUserDetailValue(detailId, value);
  }

  @Patch(':detailId/values/:valueId')
  @Roles([RoleType.SUPER_ADMIN])
  async updateUserDetailValue(
    @Param('detailId', ValidateObjectId) detailId: string,
    @Param('valueId', ValidateObjectId) valueId: string,
    @Body() { value }: UpdateDetailDtoValue,
  ) {
    return await this.userDetailsService.updateUserDetailValue(
      detailId,
      valueId,
      value,
    );
  }

  @Delete(':detailId/values/:valueId')
  @Roles([RoleType.SUPER_ADMIN])
  async removeUserDetailValue(
    @Param('detailId', ValidateObjectId) detailId: string,
    @Param('valueId', ValidateObjectId) valueId: string,
  ) {
    return await this.userDetailsService.removeUserDetailValue(
      detailId,
      valueId,
    );
  }
}
