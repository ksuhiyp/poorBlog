import { Controller, Query, Get } from '@nestjs/common';
import { TagEntity } from 'src/entities/tag.entity';
import { TagService } from './tag.service';
import { findAllQuery } from 'src/models/tag.model';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}
  @Get()
  async find(@Query('tag') query: findAllQuery): Promise<TagEntity[]> {
    return this.tagService.findAll(query);
  }
}
