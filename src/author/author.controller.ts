import { Controller, Get, Param, Post, Body, Put, Query, BadRequestException, NotFoundException, HttpStatus, Delete, UsePipes, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorDto } from './dto/author.dto';
import { Author } from './author.entity';
import { HashPasswordPipe } from '../common/pipes/hash-password.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('author')
export class AuthorController {
    constructor(private authorService: AuthorService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('/all')
    async getAll(): Promise<Author[]> {
        return await this.authorService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':username')
    async findByUserName(@Param('username') username: string): Promise<Author> {
        const authors = await this.authorService.findByUsername(username);
        if (!authors.length) {
            throw new NotFoundException(`Author ${username} not found!`)
        }
        return authors.pop();
    }
    @UsePipes(HashPasswordPipe)
    @Post('')
    async  create(@Body() author: AuthorDto): Promise<void> {
        const authors = await this.authorService.findByUsername(author.username);
        if (authors.length) {
            throw new BadRequestException(`Username ${author.username} already exists`);
        }
        await this.authorService.create(author);
        return
    }
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Body() updatedAuthor: AuthorDto, @Param('id') id: number): Promise<AuthorDto> {
        const author = await this.authorService.findOne(id);
        if (!author) {
            throw new BadRequestException(`Author id:${id} not found`)
        }
        await this.authorService.update(id, updatedAuthor);
        return updatedAuthor
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        const author = await this.authorService.findOne(id);
        if (!author) {
            throw new BadRequestException(`Author id:${id} not found`)
        }
        await this.authorService.delete(id);
    }

}
