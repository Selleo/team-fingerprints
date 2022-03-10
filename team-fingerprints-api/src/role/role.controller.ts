import { Body, Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleService } from './role.service';
import { RoleType } from './role.type';

@ApiTags('role')
@Controller({ path: 'role', version: '1' })
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @UseGuards(RoleGuard())
  async changeUserRole(
    @CurrentUserId(ValidateObjectId) userId: string,
    @Body() role: RoleType,
  ) {
    return await this.roleService.changeUserRole(userId, role);
  }
}
