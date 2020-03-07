import { Controller, Post, UseGuards, Request, Body, UsePipes, ValidationPipe, Header, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { Response } from 'express';

@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) { }
    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Request() req, @Res() res: Response) {
        const payload = this.authenticationService.login(req.user);
        res.set('Authorization', 'Bearer ' + payload.access_token);
        res.send();

    }
}
