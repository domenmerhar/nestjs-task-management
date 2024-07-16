import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from './users.repository';
import { JwtPayload } from './jwt-payload.interface';
import { UserEntity } from './user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // constructor(
  //   private usersRepository: UsersRepository,
  //   private configService: ConfigService,
  // ) {
  //   super({
  //     secretOrKey: configService.get('JWT_SECRET'),
  //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //   });
  // }

  constructor(
    private usersRepository: UsersRepository,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { username } = payload;
    const user: UserEntity = await this.usersRepository
      .getRepository()
      .findOneBy({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
