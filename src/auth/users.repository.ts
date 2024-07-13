import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuthCredetialsDto } from './dto/auth.credentials.dto';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createUser(authCredetialsDto: AuthCredetialsDto): Promise<void> {
    const user = this.create({ ...authCredetialsDto });
    await this.save(user);
  }
}
