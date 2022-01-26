import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard.guard';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    forwardRef(() => ConfigModule),
    forwardRef(() => UsersModule),
    forwardRef(() => CompanyModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
    AuthService,
  ],
  exports: [PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
