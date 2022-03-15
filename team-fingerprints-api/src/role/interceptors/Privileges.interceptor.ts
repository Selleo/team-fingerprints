import {
  CallHandler,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { RoleService } from 'src/role/role.service';
import { RoleType } from '../role.type';

@Injectable()
export class PrivilegesInterceptor implements NestInterceptor {
  constructor(
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const email = request.user.email;
    const { companyId } = request.params;

    const roleDocuments = await this.roleService.findAllRoleDocuments({
      email,
      companyId,
    });

    if (!roleDocuments || roleDocuments.length <= 0)
      throw new UnauthorizedException();

    if (roleDocuments.some((el) => el.role === RoleType.SUPER_ADMIN)) {
      request.roleDocument = {
        ...request.roleDocument,
        role: RoleType.SUPER_ADMIN,
      };
    } else if (roleDocuments.some((el) => el.role === RoleType.COMPANY_ADMIN)) {
      request.roleDocument = {
        ...request.roleDocument,
        role: RoleType.COMPANY_ADMIN,
      };
    } else if (roleDocuments.some((el) => el.role === RoleType.TEAM_LEADER)) {
      request.roleDocument = {
        ...request.roleDocument,
        role: RoleType.TEAM_LEADER,
      };
    } else {
      request.roleDocument = {
        ...request.roleDocument,
        role: RoleType.USER,
      };
    }

    return handler.handle();
  }
}
