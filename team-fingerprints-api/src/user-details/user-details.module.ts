import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { UserDetails, UserDetailsSchema } from './models/user-details.model';
import { UserDetailsController } from './user-details.controller';
import { UserDetailsService } from './user-details.service';

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature([
      {
        name: UserDetails.name,
        schema: UserDetailsSchema,
      },
    ]),
  ],
  controllers: [UserDetailsController],
  providers: [UserDetailsService],
})
export class UserDetailsModule {}
