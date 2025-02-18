import { Controller, Post, Body, BadRequestException, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninInput } from './dto/signin.input';
import { ApiResponse } from '@nestjs/swagger';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signin')
    @ApiResponse({
        status: 200,
        description: 'Signin success',
        example: {
            user: {
                id: '1',
                displayName: 'John Doe',
                profilePictureUrl: 'https://ui-avatars.com/api/?name=John+Doe&size=128&background=fff&color=333&rounded=true&bold=true',
            },
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        },
    })
    async signin(@Body(new ValidationPipe()) credential: SigninInput) {
        return this.authService.signin(credential);
    }
}