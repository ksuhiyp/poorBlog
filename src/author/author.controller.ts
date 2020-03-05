import { Controller, Get, Param, Post, Body, Put, Query, BadRequestException, NotFoundException, HttpStatus, Delete } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorDto } from './dto/author.dto';
import { Author } from './author.entity';

@Controller('author')
export class AuthorController {
    constructor(private authorService: AuthorService) { }
    @Get('/all')
    async getAll(): Promise<Author[]> {
        return await this.authorService.findAll();
    }
    @Get(':username')
    async findByUserName(@Param('username') username: string): Promise<Author> {
        const authors = await this.authorService.findByUsername(username);
        if (!authors.length) {
            throw new NotFoundException(`Author ${username} not found!`)
        }
        return authors.pop();
    }

    @Post('')
    async  create(@Body() author: AuthorDto): Promise<void> {
        // todo: check if author table has author
        const authors = await this.authorService.findByUsername(author.username );
        if (authors.length) {
            throw new BadRequestException(`Username ${author.username} already exists`);
        }
        await this.authorService.create(author);
        return
    }

    @Put(':id')
    async update(@Body() author: AuthorDto, @Param('id') id: number): Promise<AuthorDto> {
        return await this.authorService.update(id, author);

    }

    @Delete(':id')
    async delete(@Param('id') id: number) {

        await this.authorService.delete(id);
    }

}
