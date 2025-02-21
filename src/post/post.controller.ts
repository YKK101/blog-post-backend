import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, ValidationPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostInput, UpdatePostInput } from './dto/createPost.input';
import { Roles } from '@/auth/guard/roles.decorator';
import { ParentType, PublicationState, RoleType } from '@/constants/enum';
import * as qs from 'qs';
import { PostQueryInput } from './dto/postQuery.input';
import { CreateCommentInput } from '@/comment/dto/createComment.input';
import { CommentService } from '@/comment/comment.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PostDTO } from './dto/post.dto';
import { SearchResultDto } from '@/constants/dto/searchResult.dto';
import { CommentDTO } from '@/comment/dto/comment.dto';

@Controller('api/v1/posts')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly commentService: CommentService
    ) { }

    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: 'Create post success',
        type: PostDTO,
        example: {
            documentId: 'abcdefghijklmnopqrstuvwxyz0123456789',
            title: 'Hello World',
            slug: 'hello-world',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et elit eu nulla congue convallis. Sed ac eros eu nisl convallis malesuada. Nulla facilisi.',
            authorId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            categories: [
                { documentId: 'abcdefghijklmnopqrstuvwxyz0123456789', name: 'Category 1' }
            ],
            createdAt: '2024-10-21T06:24:10.000Z',
            updatedAt: '2024-10-21T06:24:10.000Z',
            publishedAt: '2024-10-21T06:24:10.000Z',
        }
    })
    @Post()
    @Roles(RoleType.USER)
    createPost(@Request() req, @Body(new ValidationPipe()) payload: CreatePostInput) {
        return this.postService.createPost(payload, req.user.sub);
    }

    @ApiQuery({
        name: 'keyword',
        required: false,
        schema: { type: 'string' }
    })
    @ApiQuery({
        name: 'categories',
        required: false,
        schema: { type: 'array', items: { type: 'string' } }
    })
    @ApiQuery({
        name: 'authors',
        required: false,
        schema: { type: 'array', items: { type: 'string' } }
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        schema: { type: 'array', items: { type: 'string' } }
    })
    @ApiQuery({
        name: 'pagination[start]',
        required: false,
        schema: { type: 'integer' }
    })
    @ApiQuery({
        name: 'pagination[limit]',
        required: false,
        schema: { type: 'integer' }
    })
    @ApiQuery({
        name: 'withAuthor',
        required: false,
        schema: { type: 'boolean' }
    })
    @ApiQuery({
        name: 'publicationState',
        required: false,
        schema: { type: 'string', enum: Object.values(PublicationState) }
    })
    @ApiResponse({
        status: 200,
        description: 'Search posts success',
        type: SearchResultDto<PostDTO>,
        example: {
            data: [
                {
                    documentId: 'abcdefghijklmnopqrstuvwxyz0123456789',
                    title: 'Hello World',
                    slug: 'hello-world',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et elit eu nulla congue convallis. Sed ac eros eu nisl convallis malesuada. Nulla facilisi.',
                    authorId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
                    categories: [
                        { documentId: 'abcdefghijklmnopqrstuvwxyz0123456789', name: 'Category 1' }
                    ],
                    createdAt: '2024-10-21T06:24:10.000Z',
                    updatedAt: '2024-10-21T06:24:10.000Z',
                    publishedAt: '2024-10-21T06:24:10.000Z',
                }
            ],
            total: 42
        }
    })
    @Get()
    searchPosts(
        @Query() queryString: string,
    ) {
        // Must support complex query on "filters", ValidationPipe not support our use case
        const query: PostQueryInput = PostQueryInput.fromParsedQuery(qs.parse(queryString));
        return this.postService.searchPosts(query);
    }

    @ApiResponse({
        status: 200,
        description: 'Get post success',
        type: PostDTO,
        example: {
            documentId: 'abcdefghijklmnopqrstuvwxyz0123456789',
            title: 'Hello World',
            slug: 'hello-world',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et elit eu nulla congue convallis. Sed ac eros eu nisl convallis malesuada. Nulla facilisi.',
            authorId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            author: {
                id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
                name: 'John Doe',
                profilePictureUrl: 'https://i.pravatar.cc/150',
            },
            categories: [
                { documentId: 'abcdefghijklmnopqrstuvwxyz0123456789', name: 'Category 1' }
            ],
            createdAt: '2024-10-21T06:24:10.000Z',
            updatedAt: '2024-10-21T06:24:10.000Z',
            publishedAt: '2024-10-21T06:24:10.000Z',
        }
    })
    @Get('slugs/:slug')
    getPostBySlug(
        @Param('slug') slug: string,
        @Query('withAuthor') withAuthor: string,
    ) {
        return this.postService.getPostBySlug(slug, withAuthor === 'true');
    }

    @ApiResponse({
        status: 200,
        description: 'Get post success',
        type: PostDTO,
        example: {
            documentId: 'abcdefghijklmnopqrstuvwxyz0123456789',
            title: 'Hello World',
            slug: 'hello-world',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et elit eu nulla congue convallis. Sed ac eros eu nisl convallis malesuada. Nulla facilisi.',
            authorId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            author: {
                id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
                name: 'John Doe',
                profilePictureUrl: 'https://i.pravatar.cc/150',
            },
            categories: [
                { documentId: 'abcdefghijklmnopqrstuvwxyz0123456789', name: 'Category 1' }
            ],
            createdAt: '2024-10-21T06:24:10.000Z',
            updatedAt: '2024-10-21T06:24:10.000Z',
            publishedAt: '2024-10-21T06:24:10.000Z',
        }
    })
    @Get(':documentId')
    getPostByDocumentId(
        @Param('documentId') documentId: string,
        @Query('withAuthor') withAuthor: string,
    ) {
        return this.postService.getPostByDocumentId(documentId, withAuthor === 'true');
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Update post success',
        type: PostDTO,
        example: {
            documentId: 'abcdefghijklmnopqrstuvwxyz0123456789',
            title: 'Hello World',
            slug: 'hello-world',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et elit eu nulla congue convallis. Sed ac eros eu nisl convallis malesuada. Nulla facilisi.',
            authorId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            categories: [
                { documentId: 'abcdefghijklmnopqrstuvwxyz0123456789', name: 'Category 1' }
            ],
            createdAt: '2024-10-21T06:24:10.000Z',
            updatedAt: '2024-10-21T06:24:10.000Z',
            publishedAt: '2024-10-21T06:24:10.000Z',
        }
    })
    @ApiResponse({
        status: 403,
        description: 'User does not have permission to update this post',
        example: {
            message: 'Only the author can manage the post',
            error: 'Forbidden',
            statusCode: 403,
        }
    })
    @Patch(':documentId')
    @Roles(RoleType.USER)
    updatePost(
        @Request() req,
        @Param('documentId') documentId: string,
        @Body(new ValidationPipe()) payload: UpdatePostInput,
    ) {
        return this.postService.updatePost(documentId, payload, req.user.sub);
    }

    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Delete post success' })
    @ApiResponse({
        status: 403,
        description: 'User does not have permission to delete this post',
        example: {
            message: 'Only the author can manage the post',
            error: 'Forbidden',
            statusCode: 403,
        }
    })
    @Delete(':documentId')
    @Roles(RoleType.USER)
    deletePost(
        @Request() req,
        @Param('documentId') documentId: string,
    ) {
        return this.postService.deletePost(documentId, req.user.sub);
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: 'Create comment success',
        type: CommentDTO,
        example: {
            documentId: 'abcdefghijklmnopqrstuvwxyz0123456789',
            content: 'This is a comment',
            authorId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            parentId: 'abcdefghijklmnopqrstuvwxyz0123456789',
            parentType: ParentType.POST,
            createdAt: '2024-10-21T06:24:10.000Z',
            updatedAt: '2024-10-21T06:24:10.000Z',
        }
    })
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

    @ApiResponse({
        status: 200,
        description: 'Get comments success',
        type: SearchResultDto<CommentDTO>,
        isArray: true,
        example: {
            data: [
                {
                    documentId: 'abcdefghijklmnopqrstuvwxyz0123456789',
                    content: 'This is a comment',
                    authorId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
                    parentId: 'abcdefghijklmnopqrstuvwxyz0123456789',
                    parentType: ParentType.POST,
                    createdAt: '2024-10-21T06:24:10.000Z',
                    updatedAt: '2024-10-21T06:24:10.000Z',
                }
            ],
            total: 1,
        }
    })
    @Get(':documentId/comments')
    getCommentsInPost(
        @Param('documentId') documentId: string,
        @Query('skip') skip: string = '0',
        @Query('take') take: string = '20',
    ) {
        return this.commentService.getCommentByParent(documentId, ParentType.POST, parseInt(skip), parseInt(take));
    }
}
