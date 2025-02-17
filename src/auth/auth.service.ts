import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthSuccessDTO } from './dto/authSuccess.dto';
import { SigninInput } from './dto/signin.input';
import { JwtPayloadDTO } from './dto/jwtPayload.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService,) { }

    async signin(credential: SigninInput): Promise<AuthSuccessDTO> {
        const user = await this.userService.getUser({ username: credential.username });

        if (!user) {
            throw new BadRequestException('Invalid Credential');
        }

        const payload: Partial<JwtPayloadDTO> = { displayName: user.displayName, sub: user.id };
        const accessToken = this.jwtService.sign(payload);

        return new AuthSuccessDTO({
            user,
            accessToken,
        });
    }
}