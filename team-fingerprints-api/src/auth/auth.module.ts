import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard.guard';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { CompanyModule } from 'src/company/company.module';
import { TeamModule } from 'src/company/team/team.module';
import { TestingAuthGuard } from './guards/TestingAuthGuard.guard';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    forwardRef(() => ConfigModule),
    forwardRef(() => UsersModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => TeamModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      inject: [ConfigService, UsersService, Reflector],
      useFactory: (
        configService: ConfigService,
        usersService: UsersService,
        reflector: Reflector,
      ) => {
        const ENV = configService.get<string>('NODE_ENV');
        if (ENV === 'test') {
          return new TestingAuthGuard(usersService);
        } else return new JwtAuthGuard(reflector);
      },
    },
    JwtStrategy,
    AuthService,
  ],
  exports: [PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
