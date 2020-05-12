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
  Req,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
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
import { UserRequestDTO } from 'src/models/user.model';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}
  @Get(':slug')
  async article(@Param('slug') slug: string): Promise<ArticleEntity> {
    const article = await this.articleService.getArticle({ slug });
    if (!article) {
      throw new NotFoundException(`No Article with id ${slug}`);
    }
    return article.toJson();
  }

  @Get()
  @UseInterceptors(PlainToClassInterceptor)
  async articles(@Query() query: GetArticlesQuery, @Req() req?: any) {
    const articles = await this.articleService.getArticles(query);
    if (!articles.length) {
      req.res.statusCode = HttpStatus.NO_CONTENT;
      return;
    }
    return articles;
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
      { name: 'photos', maxCount: 10 },
    ]),
  )
  async createArticle(
    @UploadedFiles() files,
    @Body() body: CreateArticleDTO,
    @UserParam() user: UserRequestDTO,
  ) {
    return this.articleService.createArticle(body, user, files);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
      { name: 'photos', maxCount: 10 },
    ]),
  )
  async updateArticle(
    @UploadedFiles() files,
    @Body() body: UpdateArticleDTO,
    @UserParam() user: UserEntity,
    @Param('id') id: number,
  ) {
    return this.articleService.updateArticle(id, body, user,files);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteArticle(@Param('id') id: number, @UserParam() user: UserEntity) {
    return await this.articleService.deleteArticle(id, user);
  }
}
