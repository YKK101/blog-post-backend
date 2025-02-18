import { Injectable } from '@nestjs/common';
import { CreateCommentServiceInput } from './dto/createComment.input';
import { PrismaService } from '@/prisma/prisma.service';
import { CommentDTO } from './dto/comment.dto';
import { ParentType } from '@/constants/enum';
import { SearchResultDto } from '@/constants/dto/searchResult.dto';

@Injectable()
export class CommentService {
    constructor(private readonly prismaService: PrismaService) { }

    async createComment(payload: CreateCommentServiceInput) {
        const { content, authorId, parentId, parentType } = payload;
        const comment = await this.prismaService.comment.create({
            data: {
                content,
                authorId,
                parentId,
                parentType,
            }
        });

        return CommentDTO.fromCommentJSON(comment);
    }



    async searchComment({ where, skip = 0, take = 20 }: { where?: Record<string, any>, skip?: number, take?: number }): Promise<SearchResultDto<CommentDTO>> {
        const [comments, total] = await this.prismaService.$transaction([
            this.prismaService.comment.findMany({
                where,
                include: { author: true },
                skip,
                take,
            }),
            this.prismaService.comment.count({ where }),
        ]);

        return { data: comments.map(CommentDTO.fromCommentJSON), total };
    }

    async getCommentByParent(parentId: string, parentType: ParentType, skip = 0, take = 20) {
        return this.searchComment({ where: { parentId, parentType }, skip, take })
    }
}
