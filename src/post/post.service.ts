import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostInput, UpdatePostInput } from './dto/createPost.input';
import { slugify } from 'transliteration';
import { StrapiService } from '@/strapi/strapi.service';
import { PostDTO } from './dto/post.dto';
import { UserService } from '@/user/user.service';
import { PublicationState } from '@/constants/enum';
import { PostQueryInput } from './dto/postQuery.input';
import { POST_UPDATE_UNAUTHORIZED } from '@/constants/error';
import { CategoryDTO } from './dto/category.dto';
import { SearchResultDto } from '@/constants/dto/searchResult.dto';

@Injectable()
export class PostService {
    private readonly PATH = 'posts';

    constructor(private readonly strapiService: StrapiService, private userService: UserService) { }

    async extractAuthorsMap(ids: string[]) {
        const authorIds = [...new Set(ids)];
        const authors = await this.userService.searchUsers({
            where: { id: { in: authorIds } },
        });
        const authorsMap = authors.reduce((map, author) => (map[author.id] = author, map), {});

        return authorsMap;
    }

    async createPost(payload: CreatePostInput, authorId: string, withSlugSuffix = false) {
        // Note, you can consider move slug generation logic to Strapi instance
        let slug = slugify(payload.title, { lowercase: true });
        if (withSlugSuffix) {
            slug += `-${Math.random().toString(36).substring(7)}`;
        }

        const body = { ...payload, slug, authorId };

        try {
            const { data } = await this.strapiService.createEntry(this.PATH, body);
            return PostDTO.fromPostJSON(data);
        } catch (e) {
            if (e.message === 'slug: This attribute must be unique') {
                return this.createPost(payload, authorId, true);
            } else {
                throw e;
            }
        }
    }

    async getPostByDocumentId(documentId: string, withAuthor = false) {
        try {
            const { data } = await this.strapiService.getEntry(this.PATH, documentId);

            if (withAuthor) {
                data.author = await this.userService.getUser({ id: data.authorId });
            }

            return PostDTO.fromPostJSON(data);
        } catch (e) {
            throw e;
        }
    }

    async getPostBySlug(slug: string, withAuthor = false) {
        try {
            const { data } = await this.strapiService.searchEntries(this.PATH, { filters: { slug } });
            if (data.length === 0) {
                throw new NotFoundException(`Post with slug ${slug} not found`);
            }
            const post = data[0];
            if (withAuthor) {
                post.author = await this.userService.getUser({ id: post.authorId });
            }

            return PostDTO.fromPostJSON(post);
        } catch (e) {
            throw e;
        }
    }

    async searchPosts({
        keyword, categories, authors, sort, pagination, withAuthor = false, publicationState = PublicationState.LIVE
    }: PostQueryInput): Promise<SearchResultDto<PostDTO>> {
        try {
            let keywordFilters = {}
            if (!!keyword) {
                keywordFilters = {
                    $or: [
                        {
                            title: {
                                $containsi: keyword
                            }
                        },
                        {
                            slug: {
                                $containsi: keyword
                            }
                        },
                        {
                            content: {
                                $contains: keyword
                            }
                        }
                    ],
                }
            }

            let categoryFilters = {}
            if (!!categories && categories.length > 0) {
                categoryFilters = { categories: { documentId: categories } }
            }

            let authorFilters = {}
            if (!!authors && authors.length > 0) {
                authorFilters = { authorId: authors }
            }

            const formattedFilters = { '$and': [categoryFilters, keywordFilters, authorFilters].filter(filter => filter && Object.keys(filter).length > 0) }

            const searchOptions = { filters: formattedFilters, sort, pagination, publicationState }
            const { data, meta } = await this.strapiService.searchEntries(this.PATH, searchOptions);

            if (withAuthor) {
                const authorsMap = await this.extractAuthorsMap(data.map(post => post.authorId))
                data.forEach(post => (post.author = authorsMap[post.authorId]));
            }

            return { data: data.map(PostDTO.fromPostJSON), total: meta.pagination.total };
        } catch (e) {
            throw e;
        }
    }

    async updatePost(documentId: string, payload: UpdatePostInput, requestUserId: string) {
        try {
            const post = await this.getPostByDocumentId(documentId, false);
            if (post.authorId !== requestUserId) {
                throw new ForbiddenException(POST_UPDATE_UNAUTHORIZED);
            }

            const { data } = await this.strapiService.updateEntry(this.PATH, documentId, payload);
            return PostDTO.fromPostJSON(data);
        } catch (e) {
            throw e;
        }
    }

    async deletePost(documentId: string, requestUserId: string) {
        try {
            const post = await this.getPostByDocumentId(documentId, false);
            if (post.authorId !== requestUserId) {
                throw new ForbiddenException(POST_UPDATE_UNAUTHORIZED);
            }

            await this.strapiService.deleteEntry(this.PATH, documentId);
        } catch (e) {
            throw e;
        }
    }

    async listCategories() {
        try {
            let start = 0
            const limit = 20
            const categories: CategoryDTO[] = []

            while (true) {
                const pagination = { start, limit }
                const { data } = await this.strapiService.searchEntries('categories', { pagination });
                if (data.length === 0) {
                    break;
                }

                categories.push(...data.map(CategoryDTO.fromCategoryJSON));
                start += data.length;
            }

            return categories;
        } catch (e) {
            throw e;
        }
    }
}
