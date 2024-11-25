import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request,Response  } from 'express';
import { UserEntity } from '../users/entities/user.entity';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body('originalUrl') originalUrl:string , @Req() req:Request) {
    const user = req.user as UserEntity;
    return this.urlsService.shortUrl(originalUrl, user);
  }

  @Get(':shortUrl')
  async redirectToOriginalUrl(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const url = await this.urlsService.findByShortUrl(shortUrl);
    res.redirect(url.originalUrl);
  }
  @Get()
  @UseGuards(AuthGuard)
  listUrls(@Req() req: Request) {
    const user = req.user as UserEntity;
    return this.urlsService.listUserUrls(user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body('newUrl') newUrl: string, @Req() req: Request) {
    const user = req.user as UserEntity;
    return this.urlsService.updateUrl(id, newUrl, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as UserEntity;
    await this.urlsService.deleteUrl(id, user);
    return { message: 'Url deleted successfully' };
  }
}
 