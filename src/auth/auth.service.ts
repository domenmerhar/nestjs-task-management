import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredetialsDto } from './dto/auth.credentials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  createUser(authCredetialsDto: AuthCredetialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredetialsDto);
  }
}
