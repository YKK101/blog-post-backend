import { UserDTO } from "@/user/dto/user.dto";

export class AuthSuccessDTO {
    user: UserDTO;
    accessToken: string;

    constructor(partial: Partial<AuthSuccessDTO>) {
        Object.assign(this, partial);
    }
}
