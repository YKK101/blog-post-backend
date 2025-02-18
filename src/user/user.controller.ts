import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/createUser.input';
import { Roles } from '@/auth/guard/roles.decorator';
import { RoleType } from '@/constants/enum';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @Roles(RoleType.ADMIN)
    async createUser(@Body(new ValidationPipe()) payload: CreateUserInput) {
        return this.userService.createUser(payload);
    }
}