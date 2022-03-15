import { Controller, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleService } from './role.service';
import { Role } from './models/role.model';

@ApiTags('role')
@Controller({ path: 'role', version: '1' })
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Delete('/:roleId/leave')
  async removeRole(@Param('roleId', ValidateObjectId) roleId: string) {
    await this.roleService.removeRoleDocumentById({ _id: roleId } as Role);
  }
}
