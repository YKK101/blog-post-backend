import { UserDTO } from "@/user/dto/user.dto";
import { CategoryDTO } from "./category.dto";

export class PostDTO {
    documentId: string;
    title: string;
    content: string;
    authorId: string;
    author: UserDTO | undefined;
    slug: string;
    categories: CategoryDTO[] | undefined;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    commentCount: number;

    constructor(partial: Partial<PostDTO>) {
        Object.assign(this, partial);
    }

    static fromPostJSON(post: JSON): PostDTO {
        return new PostDTO({
            documentId: post['documentId'],
            title: post['title'],
            content: post['content'],
            authorId: post['authorId'],
            author: post['author'] ? UserDTO.fromUser(post['author']) : undefined,
            slug: post['slug'],
            categories: post['categories'] ? post['categories']?.map(category => CategoryDTO.fromCategoryJSON(category)) : undefined,
            createdAt: post['createdAt'],
            updatedAt: post['updatedAt'],
            publishedAt: post['publishedAt'],
            commentCount: post['commentCount']
        });
    }
}
