import { RoleType } from "@/constants/enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateUserInput {
    @ApiProperty({ description: 'Username generated by admin', example: 'john2025' })
    @IsString()
    username: string;

    @ApiProperty({ description: 'The name displayed on website', example: 'John Doe' })
    @IsString()
    displayName: string;

    @ApiProperty({ description: 'The url of profile picture', required: false, example: 'https://example.com/johndoe.jpg' })
    @IsUrl()
    @IsOptional()
    profilePictureUrl?: string;

    @ApiProperty({ description: 'The roles of user', required: false, example: '["user", "admin"]', default: '["user"]' })
    @IsArray()
    @IsOptional()
    roles?: RoleType[];
};
