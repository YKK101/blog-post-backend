import { ParentType } from "@/constants/enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";

export class CreateCommentInput {
    @ApiProperty({ description: 'The content of comment', example: 'Wow! So Excited!', required: true })
    @IsString()
    content: string
}

export class CreateCommentServiceInput extends CreateCommentInput {
    @IsString()
    authorId: string

    @IsString()
    parentId: string

    @IsEnum(ParentType)
    parentType: ParentType
}