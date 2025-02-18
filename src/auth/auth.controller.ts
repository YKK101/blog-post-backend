import { Controller, Post, Body, BadRequestException, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninInput } from './dto/signin.input';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signin')
    async signin(@Body(new ValidationPipe()) credential: SigninInput) {
        return this.authService.signin(credential);
    }
}