import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common';
import { CreateUserInput } from './dto/createUser.input';
import { Roles } from '@/auth/guard/roles.decorator';
import { RoleType } from '@/constants/enum';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @Roles(RoleType.ADMIN)
    async createUser(@Body() payload: CreateUserInput) {
        if (!payload?.username) {
            throw new BadRequestException('"username" is required');
        } else if (!payload?.displayName) {
            throw new BadRequestException('"displayName" is required');
        }

        return this.userService.createUser(payload);
    }
}