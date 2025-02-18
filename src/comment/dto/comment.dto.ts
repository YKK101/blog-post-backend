import { ParentType } from "@/constants/enum"
import { UserDTO } from "@/user/dto/user.dto";
import { Comment } from "@prisma/client";

export class CommentDTO {
    id: string;
    content: string;
    authorId: string;
    author?: UserDTO;
    parentId?: string;
    parentType?: ParentType;
    createdAt: string;
    updatedAt: string;

    constructor(partial: Partial<CommentDTO>) {
        Object.assign(this, partial);
    }

    static fromCommentJSON(json: Record<string, any>): CommentDTO {
        return new CommentDTO({
            id: json['id'],
            content: json['content'],
            authorId: json['authorId'],
            author: json['author'] ? UserDTO.fromUser(json['author']) : undefined,
            parentId: json['parentId'],
            parentType: json['parentType'] as ParentType,
            createdAt: json['createdAt'],
            updatedAt: json['updatedAt'],
        });
    }
}