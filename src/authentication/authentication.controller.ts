import { Controller, Post, UseGuards, Request, Body, UsePipes, ValidationPipe, Header, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { Response } from 'express';

@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) { }
    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Request() req) {
        return this.authenticationService.login(req.user);

    }
}
