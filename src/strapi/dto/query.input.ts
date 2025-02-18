export class StrapiPaginationInput {
    start?: number;
    limit?: number;
    page?: number;
    pageSize?: number;
    withCount?: boolean;

    constructor(partial: Partial<StrapiPaginationInput>) {
        Object.assign(this, partial);
    }

    static fromJSON(json: Record<string, any>): StrapiPaginationInput {
        if (!json) { return undefined; }

        return {
            start: json['start'] ? parseInt(json['start']) : undefined,
            limit: json['limit'] ? parseInt(json['limit']) : undefined,
            page: json['page'] ? parseInt(json['page']) : undefined,
            pageSize: json['pageSize'] ? parseInt(json['pageSize']) : undefined,
            withCount: json['withCount'] ? json['withCount'] === 'true' : undefined,
        };
    }
}