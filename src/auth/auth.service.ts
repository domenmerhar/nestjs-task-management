import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(authCredetialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredetialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.usersRepository.sigIn(authCredentialsDto);
  }
}
