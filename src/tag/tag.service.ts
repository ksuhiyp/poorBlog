import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '../entities/tag.entity';
import { findAllQuery } from '../models/tag.model';
import { Repository, Like } from 'typeorm';

@Injectable()
export class TagService {
  constructor(@InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>) {}

  findAll(query?: findAllQuery): Promise<TagEntity[]> {
    let condition;
    if (query) {
      condition = { title: Like(`%${query?.title}%`) };
    }
    return this.tagRepo.find(condition);
  }
}
