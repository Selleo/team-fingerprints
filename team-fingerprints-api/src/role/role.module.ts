import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from 'src/company/company.module';
import { TeamModule } from 'src/company/team/team.module';
import { User, UserSchema } from 'src/users/models/user.model';
import { PrivilegesInterceptor } from './interceptors/Privileges.interceptor';
import { Role, RoleSchema } from './models/role.model';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    forwardRef(() => TeamModule),
    forwardRef(() => CompanyModule),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService, PrivilegesInterceptor],
  exports: [RoleService, PrivilegesInterceptor],
})
export class RoleModule {}
