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
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticleService } from './article.service';
import { ArticleEntity } from '../entities/article.entity';
import { GetArticlesQuery, UpdateArticleDTO, DeleteArticleImageDTO } from '../models/article.model';
import { AuthGuard } from '@nestjs/passport';
import { UserParam } from '../common/decorators/user.decorator';
import { UserEntity } from '../entities/user.entity';
import { PlainToClassInterceptor } from '../common/interceptors/plain-to-class.interceptor';
import { UserRequestDTO } from 'src/models/user.model';

@Controller('article')
@UseInterceptors(PlainToClassInterceptor)
export class ArticleController {
  constructor(private articleService: ArticleService) {}
  @Get(':slugOrId')
  async article(@Param('slugOrId') slugOrId: string | number): Promise<ArticleEntity> {
    const article = await this.articleService.getArticle(slugOrId);
    if (!article) {
      throw new NotFoundException(`No Article with id ${slugOrId}`);
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
  async createArticle(@Body() body: ArticleEntity, @UserParam() Author: UserEntity): Promise<ArticleEntity> {
    return this.articleService.createArticle(body, Author);
  }

  @Patch(':id/poster')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('poster'))
  async patchArticlePoster(
    @Param('id')
    id: number,
    @UploadedFile() poster: MulterS3File,
  ) {
    return this.articleService.patchArticlePoster(id, poster);
  }

  @Patch(':id/image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async patchArticleImages(@Param('id') articleId: number, @UploadedFile() image: MulterS3File) {
    const imageData = await this.articleService.patchArticleImages(articleId, image);
    return { url: imageData.Location };
  }

  @Delete(':id/images')
  @UseGuards(AuthGuard('jwt'))
  async deleteArticleImage(@Param('id') articleId: number, @Body() body: DeleteArticleImageDTO) {
    return this.articleService.deleteArticleImage(articleId, body);
  }
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateArticle(@Body() body: UpdateArticleDTO, @UserParam() user: Partial<UserEntity>, @Param('id') id: number) {
    return this.articleService.updateArticle(id, body, user);
  }
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteArticle(@Param('id') id: number, @UserParam() user: UserRequestDTO) {
    return await this.articleService.deleteArticle(id, user);
  }
}
