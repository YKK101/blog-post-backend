import { Controller, Get } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiResponse } from '@nestjs/swagger';
import { CategoryDTO } from './dto/category.dto';

@Controller('api/v1/categories')
export class CategoryController {
    constructor(private readonly postService: PostService) { }

    @ApiResponse({
        status: 200,
        description: 'The categories have been successfully retrieved.',
        type: CategoryDTO,
        isArray: true,
        example: [{ 'documentId': 'fkld2mn4p3klr5effds', 'name': 'Technology' }]
    })
    @Get()
    getCategories() {
        return this.postService.listCategories();
    }
}
