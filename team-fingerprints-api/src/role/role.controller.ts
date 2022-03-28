import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleService } from './role.service';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { Roles } from './decorators/roles.decorator';
import { RoleType } from './role.type';

@ApiTags('role')
@Controller({ path: 'role', version: '1' })
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('superAdmin')
  @Roles([RoleType.SUPER_ADMIN])
  async addSuperAdmin(@Body('email') email: string) {
    return await this.roleService.addSuperAdmin(email);
  }

  @Delete('/:roleId/leave')
  async leave(
    @CurrentUserId(ValidateObjectId) userId: string,
    @Param('roleId', ValidateObjectId) roleId: string,
  ) {
    await this.roleService.leave(userId, roleId);
  }

  @Delete('/:roleId/remove')
  async removeRole(
    @CurrentUserId(ValidateObjectId) currentUserId: string,
    @Param('roleId', ValidateObjectId) roleId: string,
  ) {
    await this.roleService.removeRole(roleId, currentUserId);
  }
}
