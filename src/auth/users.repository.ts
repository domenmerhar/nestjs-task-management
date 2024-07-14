import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createUser(authCredetialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = this.create({ ...authCredetialsDto });

    //hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log({ salt });
    console.log({ hashedPassword });

    const user = this.create({ username, password: hashedPassword });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException(`Username already exists`);
      else throw new InternalServerErrorException();
    }
  }

  async sigIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    const user = await this.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    } else
      throw new UnauthorizedException('Please check your login credentials');
  }
}
