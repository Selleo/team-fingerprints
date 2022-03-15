import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleService } from './role.service';
import { RoleType } from './role.type';
import { Roles } from './decorators/roles.decorator';

@ApiTags('role')
@Controller({ path: 'role', version: '1' })
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Roles([RoleType.SUPER_ADMIN])
  async changeUserRole(
    @CurrentUserId(ValidateObjectId) userId: string,
    @Body() role: RoleType,
  ) {
    return await this.roleService.changeUserRole(userId, role);
  }
}
