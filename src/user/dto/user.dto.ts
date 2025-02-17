import { User } from "@prisma/client";

export class UserDTO {
    constructor(partial: Partial<UserDTO>) {
        Object.assign(this, partial);
    }

    id: string;

    displayName: string;

    profilePictureUrl?: string | null;

    static fromUser(user: User): UserDTO {
        return new UserDTO({
            id: user.id,
            displayName: user.displayName,
            profilePictureUrl: user.profilePictureUrl,
        });
    }
}