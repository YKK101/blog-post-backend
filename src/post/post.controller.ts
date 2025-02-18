import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, ValidationPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostInput, UpdatePostInput } from './dto/createPost.input';
import { Roles } from '@/auth/guard/roles.decorator';
import { ParentType, RoleType } from '@/constants/enum';
import * as qs from 'qs';
import { PostQueryInput } from './dto/postQuery.input';
import { CreateCommentInput } from '@/comment/dto/createComment.input';
import { CommentService } from '@/comment/comment.service';

@Controller('posts')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly commentService: CommentService
    ) { }

    @Post()
    @Roles(RoleType.USER)
    createPost(@Request() req, @Body(new ValidationPipe()) payload: CreatePostInput) {
        return this.postService.createPost(payload, req.user.sub);
    }

    @Get()
    searchPosts(
        @Query() queryString: string,
    ) {
        // Must support complex query on "filters", ValidationPipe not support our use case
        const query: PostQueryInput = PostQueryInput.fromParsedQuery(qs.parse(queryString));
        return this.postService.searchPosts(query);
    }

    @Get(':documentId')
    getPostByDocumentId(
        @Param('documentId') documentId: string,
        @Query('withAuthor') withAuthor: string,
    ) {
        return this.postService.getPostByDocumentId(documentId, withAuthor === 'true');
    }

    @Patch(':documentId')
    @Roles(RoleType.USER)
    updatePost(
        @Request() req,
        @Param('documentId') documentId: string,
        @Body(new ValidationPipe()) payload: UpdatePostInput,
    ) {
        return this.postService.updatePost(documentId, payload, req.user.sub);
    }

    @Delete(':documentId')
    @Roles(RoleType.USER)
    deletePost(
        @Request() req,
        @Param('documentId') documentId: string,
    ) {
        return this.postService.deletePost(documentId, req.user.sub);
    }

    @Post(':documentId/comments')
    @Roles(RoleType.USER)
    createCommentInPost(
        @Request() req,
        @Param('documentId') documentId: string,
        @Body(new ValidationPipe()) payload: CreateCommentInput,
    ) {
        return this.commentService.createComment({
            ...payload,
            authorId: req.user.sub,
            parentId: documentId,
            parentType: ParentType.POST,
        });
    }

    @Get(':documentId/comments')
    getCommentsInPost(
        @Param('documentId') documentId: string,
        @Query('skip') skip: string = '0',
        @Query('take') take: string = '20',
    ) {
        return this.commentService.getCommentByParent(documentId, ParentType.POST, parseInt(skip), parseInt(take));
    }
}
