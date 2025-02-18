import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserModule } from '@/user/user.module';

@Module({
  controllers: [CommentController],
  imports: [PrismaModule, UserModule],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule { }
