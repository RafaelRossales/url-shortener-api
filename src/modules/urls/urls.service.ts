import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlEntity } from './entities/url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class UrlsService {

  constructor(
    @InjectRepository(UrlEntity)
    private readonly urlRepository:Repository<UrlEntity>
  ){}

  async shortUrl(originalUrl: string,user:UserEntity): Promise<UrlEntity> {
    const shortUrl = crypto.randomBytes(6).toString('base64');
    const url = this.urlRepository.create({originalUrl,shortUrl,user});
    return this.urlRepository.save(url);
  }

  async findByShortUrl(shortUrl: string): Promise<UrlEntity> {
    const url = await this.urlRepository.findOne({where:{shortUrl,deletedAt: null}});
    if(!url) throw new NotFoundException('Url not found');
    url.clicks += 1;
    await this.urlRepository.save(url);
    return url;
  }

  async listUserUrls(user: UserEntity): Promise<UrlEntity[]> {
    return this.urlRepository.find({
      where:{userId:user.id, deletedAt:null }
    });
  }

  async updateUrl(id: string,newUrl:string, user:UserEntity): Promise<UrlEntity> {
    const url = await this.urlRepository.findOne({ where: { id, userId:user.id, deletedAt: null } });
    if(!url) throw new NotFoundException('Url not found');
    url.originalUrl = newUrl;
    return this.urlRepository.save(url);
  }


  async deleteUrl(id: string, user: UserEntity): Promise<void> {
    const url = await this.urlRepository.findOne({ where: { id, userId:user.id, deletedAt: null } });
    if(!url) throw new NotFoundException('Url not found');
    url.deletedAt = new Date();
    await this.urlRepository.save(url);
  }

}
