import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { CompanyModule } from 'src/company/company.module';
import { TeamModule } from 'src/company/team/team.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => CompanyModule),
    forwardRef(() => TeamModule),
    forwardRef(() => RoleModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
