import { Controller, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleService } from './role.service';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';

@ApiTags('role')
@Controller({ path: 'role', version: '1' })
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

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
