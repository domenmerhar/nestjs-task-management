import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredetialsDto } from './dto/auth.credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredetialsDto: AuthCredetialsDto): Promise<void> {
    return this.authService.createUser(authCredetialsDto);
  }
}
