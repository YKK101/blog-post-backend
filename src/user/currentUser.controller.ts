import { Controller, Get, NotFoundException, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '@/auth/guard/roles.decorator';
import { RoleType } from '@/constants/enum';
import { JwtPayloadDTO } from '@/auth/dto/jwtPayload.dto';

@Controller('me')
export class CurrentUserController {
    constructor(private readonly userService: UserService) { }

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