import { Controller, Get, NotFoundException, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '@/auth/guard/roles.decorator';
import { RoleType } from '@/constants/enum';
import { JwtPayloadDTO } from '@/auth/dto/jwtPayload.dto';
import { UserDTO } from './dto/user.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('api/v1/me')
export class CurrentUserController {
    constructor(private readonly userService: UserService) { }

    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Get current user profile success',
        type: UserDTO,
        example: {
            id: '7f7c1f06-3f1d-4e95-8f1a-d9e6bfaa6a6a',
            username: 'john2025',
            displayName: 'John Doe',
            profilePictureUrl: 'https://example.com/johndoe.jpg',
        }
    })
    @Get()
    @Roles(RoleType.USER)
    async getMyProfile(@Request() request) {
        const requestUser = request.user as JwtPayloadDTO;
        const user = await this.userService.getUser({ id: requestUser.sub });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}