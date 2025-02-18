import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { StrapiModule } from '@/strapi/strapi.module';
import { UserModule } from '@/user/user.module';
import { CategoryController } from './category.controller';
import { CommentModule } from '@/comment/comment.module';

@Module({
  providers: [PostService],
  imports: [StrapiModule, UserModule, CommentModule],
  controllers: [PostController, CategoryController]
})
export class PostModule { }
