import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('authentication')
export class AuthenticationController {

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) { 
        return req.user
    }
}
