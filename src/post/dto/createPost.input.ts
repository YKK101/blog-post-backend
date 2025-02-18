import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePostInput {
    @ApiProperty({ description: 'The title of post', example: 'Hello World', required: false })
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty({ description: 'The content of post', example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et elit eu nulla congue convallis. Sed ac eros eu nisl convallis malesuada. Nulla facilisi.', required: false })
    @IsString()
    @IsOptional()
    content: string;

    @ApiProperty({ description: 'The categories documentId of post', example: '["tech", "coding"]', required: false })
    @IsArray()
    @IsOptional()
    categories: string[];
}

export class CreatePostInput {
    @ApiProperty({ description: 'The title of post', example: 'Hello World' })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'The content of post',
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.',
    })
    @IsString()
    content: string;

    @ApiProperty({ description: 'The categories documentId of post', example: '["tech", "coding"]' })
    @IsArray()
    categories: string[];
}
