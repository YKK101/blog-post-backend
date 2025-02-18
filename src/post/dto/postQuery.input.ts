import { PublicationState } from "@/constants/enum";
import { StrapiPaginationInput } from "@/strapi/dto/query.input";

export class PostQueryInput {
    keyword?: string;
    filters?: Record<string, any>;
    sort?: string[] | string;
    pagination?: StrapiPaginationInput;
    withAuthor?: boolean;
    publicationState?: PublicationState;

    constructor(partial: Partial<PostQueryInput>) {
        Object.assign(this, partial);
    }

    static fromParsedQuery(json: Record<string, any>): PostQueryInput {
        return {
            keyword: json['keyword'],
            filters: json['filters'],
            sort: json['sort'],
            pagination: StrapiPaginationInput.fromJSON(json['pagination']),
            withAuthor: json['withAuthor'] === 'true',
            publicationState: json['publicationState'],
        }
    }
}