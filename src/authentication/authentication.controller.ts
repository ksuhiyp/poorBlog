import { Controller, Post, UseGuards, Request, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthorDto } from 'src/author/dto/author.dto';

@Controller('authentication')
export class AuthenticationController {
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req, @Body() user: AuthorDto) {
        return req.user
    }
}
