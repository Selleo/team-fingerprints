import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamModule } from 'src/company/team/team.module';
import { User, UserSchema } from 'src/users/models/user.model';
import { Role, RoleSchema } from './models/role.model';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    forwardRef(() => TeamModule),
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
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
