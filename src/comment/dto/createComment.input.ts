import { ParentType } from "@/constants/enum";
import { IsEnum, IsString } from "class-validator";

export class CreateCommentInput {
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