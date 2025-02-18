import { RoleType } from "@/constants/enum";
import { IsArray, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateUserInput {
    @IsString()
    username: string;

    @IsString()
    displayName: string;

    @IsUrl()
    @IsOptional()
    profilePictureUrl?: string;

    @IsArray()
    @IsOptional()
    roles?: RoleType[];
};
