import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CurrentUserController } from './currentUser.controller';

@Module({
    controllers: [UserController, CurrentUserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }