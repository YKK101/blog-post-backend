import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninInput } from './dto/signin.input';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signin')
    async signin(@Body() credential: SigninInput) {
        if (!credential?.username) {
            throw new BadRequestException('"username" is required');
        }

        return this.authService.signin(credential);
    }
}