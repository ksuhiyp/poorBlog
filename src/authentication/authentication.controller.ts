import { Controller, Post, UseGuards, Request, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthorDto } from 'src/author/dto/author.dto';

@Controller('auth')
export class AuthenticationController {
    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Request() req) {
        return req.user
    }
}
