import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleService } from './role.service';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { Roles } from './decorators/roles.decorator';
import { RoleType } from 'team-fingerprints-common';
import { RoleModel } from './models/role.model';
import { EmailDto } from 'src/company/dto/company.dto';

@ApiTags('role')
@Controller({ path: 'role', version: '1' })
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiBody({
    description: 'Pass an email that needs to become super admin',
    type: EmailDto,
  })
  @ApiResponse({
    status: 201,
    description: 'New super admin role',
    type: RoleModel,
  })
  @Post('superAdmin')
  @Roles([RoleType.SUPER_ADMIN])
  async addSuperAdmin(@Body() { email }: EmailDto): Promise<RoleModel> {
    return await this.roleService.addSuperAdminRole(email);
  }

  @ApiParam({
    name: 'roleId',
    type: String,
    description: 'Role to leave',
  })
  @ApiResponse({
    status: 200,
    description: 'Left role',
    type: RoleModel,
  })
  @Delete('/:roleId/leave')
  async leave(
    @CurrentUserId(ValidateObjectId) userId: string,
    @Param('roleId', ValidateObjectId) roleId: string,
  ): Promise<RoleModel> {
    return await this.roleService.leave(userId, roleId);
  }

  @ApiParam({
    name: 'roleId',
    type: String,
    description: 'Role to remove',
  })
  @ApiResponse({
    status: 200,
    description: 'Removed role',
    type: RoleModel,
  })
  @Delete('/:roleId/remove')
  async removeRole(
    @CurrentUserId(ValidateObjectId) currentUserId: string,
    @Param('roleId', ValidateObjectId) roleId: string,
  ): Promise<RoleModel> {
    return await this.roleService.removeRole(roleId, currentUserId);
  }
}
