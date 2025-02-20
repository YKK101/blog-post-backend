import { PublicationState } from "@/constants/enum";
import { StrapiPaginationInput } from "@/strapi/dto/query.input";

export class PostQueryInput {
    keyword?: string;
    categories?: string[];
    authors?: string[];
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
            categories: json['categories'],
            authors: json['authors'],
            sort: json['sort'],
            pagination: StrapiPaginationInput.fromJSON(json['pagination']),
            withAuthor: json['withAuthor'] === 'true',
            publicationState: json['publicationState'],
        }
    }
}