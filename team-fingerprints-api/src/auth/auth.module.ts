import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard.guard';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { CompanyModule } from 'src/company/company.module';
import { TeamModule } from 'src/company/team/team.module';
import { RoleModule } from 'src/role/role.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    forwardRef(() => ConfigModule),
    forwardRef(() => UsersModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => TeamModule),
    forwardRef(() => RoleModule),
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [JwtAuthGuard, JwtStrategy, AuthService],
  exports: [PassportModule, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
