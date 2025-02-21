import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateCommentServiceInput } from './dto/createComment.input';
import { PrismaService } from '@/prisma/prisma.service';
import { CommentDTO } from './dto/comment.dto';
import { ParentType } from '@/constants/enum';
import { SearchResultDto } from '@/constants/dto/searchResult.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class CommentService {
    constructor(private readonly prismaService: PrismaService, @Inject(CACHE_MANAGER) private cacheManager: Cache) { }

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
        await this.increaseCommentCountByParent(parentId, parentType);

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

    async getCommentCountByParent(parentId: string, parentType: ParentType): Promise<number> {
        const count: number = await this.cacheManager.get(`${parentType}-${parentId}-comment-count`);

        if (count) {
            return count;
        }

        const result = await this.prismaService.comment.count({ where: { parentId, parentType } });
        await this.cacheManager.set(`${parentType}-${parentId}-comment-count`, result);
        return result;
    }

    async increaseCommentCountByParent(parentId: string, parentType: ParentType) {
        const count = await this.getCommentCountByParent(parentId, parentType);
        await this.cacheManager.set(`${parentType}-${parentId}-comment-count`, count + 1);
    }

    async resetCommentCountByParent(parentId: string, parentType: ParentType) {
        await this.cacheManager.del(`${parentType}-${parentId}-comment-count`);
    }
}
