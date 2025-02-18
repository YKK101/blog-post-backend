export class CategoryDTO {
    documentId: string;
    name: string;

    constructor(partial: Partial<CategoryDTO>) {
        Object.assign(this, partial);
    }

    static fromCategoryJSON(category: JSON): CategoryDTO {
        return new CategoryDTO({
            documentId: category['documentId'],
            name: category['name']
        });
    }
}
