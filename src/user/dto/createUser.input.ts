import { RoleType } from "@/constants/enum";

export interface CreateUserInput {
    readonly username: string;
    readonly displayName: string;
    readonly profilePictureUrl?: string;
    readonly roles?: RoleType[];
}
