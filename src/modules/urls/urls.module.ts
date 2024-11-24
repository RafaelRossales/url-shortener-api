import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { UrlEntity } from './entities/url.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UrlEntity])],
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule {}