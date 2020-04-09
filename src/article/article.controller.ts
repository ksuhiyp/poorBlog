import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
  Post,
  Body,
  UseGuards,
  Put,
  UseInterceptors,
  Delete,
  HttpStatus,
  Res,
  Req,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleEntity } from '../entities/article.entity';
import {
  GetArticlesQuery,
  CreateArticleDTO,
  UpdateArticleDTO,
} from '../models/article.model';
import { AuthGuard } from '@nestjs/passport';
import { UserParam } from '../common/decorators/user.decorator';
import { UserEntity } from '../entities/user.entity';
import { PlainToClassInterceptor } from '../common/interceptors/plain-to-class.interceptor';
import { stat } from 'fs';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}
  @Get(':id')
  async article(@Param('id') id: number): Promise<ArticleEntity> {
    const article = await this.articleService.getArticle({ id });
    if (!article) {
      throw new NotFoundException(`No Article with id ${id}`);
    }
    return article;
  }

  @Get()
  @UseInterceptors(PlainToClassInterceptor)
  async articles(@Query() query: GetArticlesQuery, @Req() req?:any) {
    const articles = await this.articleService.getArticles(query);
    if (!articles.length) {
      req.res.statusCode=HttpStatus.NO_CONTENT
      return 
    }
    return articles;
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createArticle(
    @Body() body: CreateArticleDTO,
    @UserParam() user: UserEntity,
  ) {
    return await this.articleService.createArticle(body, user);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateArticle(
    @Body() body: UpdateArticleDTO,
    @UserParam() user: UserEntity,
    @Param('id') id: number,
  ) {
    return this.articleService.updateArticle(id, body, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteArticle(@Param('id') id: number, @UserParam() user: UserEntity) {
    return await this.articleService.deleteArticle(id, user);
  }
}
