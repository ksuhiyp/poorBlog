import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from 'src/entities/article.entity';
import {
  GetArticlesQuery,
  CreateArticleDTO,
  UpdateArticleDTO,
} from 'src/models/article.model';
import { AuthGuard } from '@nestjs/passport';
import { UserParam } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { PlainToClassInterceptor } from 'src/common/interceptors/plain-to-class.interceptor';

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}
  @Get(':id')
  async article(@Param('id') id: number): Promise<Article> {
    const article = await this.articleService.getArticle({ id });
    if (!article) {
      throw new NotFoundException(`No Article with id ${id}`);
    }
    return article;
  }

  @Get()
  @UseInterceptors(PlainToClassInterceptor)
  async articles(@Query() query: GetArticlesQuery) {
    const articles = await this.articleService.getArticles(query);
    return articles;
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createArticle(@Body() body: CreateArticleDTO, @UserParam() user: User) {
    return await this.articleService.createArticle(body, user);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateArticle(
    @Body() body: UpdateArticleDTO,
    @UserParam() user: User,
    @Param('id') id: number,
  ) {
    return this.articleService.updateArticle(id, body, user);
  }
}
