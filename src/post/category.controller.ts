import { Controller, Get } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('categories')
export class CategoryController {
    constructor(private readonly postService: PostService) { }

    @Get()
    getCategories() {
        return this.postService.listCategories();
    }
}
