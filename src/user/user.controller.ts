import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/createUser.input';
import { Roles } from '@/auth/guard/roles.decorator';
import { RoleType } from '@/constants/enum';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/v1/users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Admin Only!' })
    @ApiResponse({
        status: 201,
        description: 'Create user success',
        example: {
            id: '6f1f0a7f-2b6a-4d0f-9f09-727738f4e9c1',
            username: 'john2025',
            displayName: 'John Doe',
            profilePictureUrl: 'https://example.com/profile-picture.jpg'
        }
    })
    @ApiResponse({
        status: 403,
        description: 'User not have permission to create user',
        example: {
            message: 'Forbidden resource',
            error: 'Forbidden',
            statusCode: 403
        }
    })
    @Post()
    @Roles(RoleType.ADMIN)
    async createUser(@Body(new ValidationPipe()) payload: CreateUserInput) {
        return this.userService.createUser(payload);
    }
}