import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePostInput {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    content: string;

    @IsArray()
    @IsOptional()
    categories: string[];
}

export class CreatePostInput {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsArray()
    categories: string[];
}
