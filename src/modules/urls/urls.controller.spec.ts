import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserEntity } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';

const mockUrlsService = () => ({
  shortUrl: jest.fn(),
  findByShortUrl: jest.fn(),
  listUserUrls: jest.fn(),
  updateUrl: jest.fn(),
  deleteUrl: jest.fn(),
});

const mockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('UrlsController', () => {
  let controller: UrlsController;
  let service: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        {
          provide: UrlsService,
          useFactory: mockUrlsService,
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    controller = module.get<UrlsController>(UrlsController);
    service = module.get<UrlsService>(UrlsService);
  });

  describe('create', () => {
    it('should create a short URL', async () => {
      const user = new UserEntity();
      const url = { originalUrl: 'http://example.com', shortUrl: 'shortUrl' };
      jest.spyOn(service, 'shortUrl').mockResolvedValue(url as any);

      const req = { user }  as unknown as  Request;
      const result = await controller.create('http://example.com', req);
      expect(result).toBe(url);
      expect(service.shortUrl).toHaveBeenCalledWith('http://example.com', user);
    });
  });

  describe('redirectToOriginalUrl', () => {
    it('should redirect to the original URL', async () => {
      const url = { originalUrl: 'http://example.com' };
      jest.spyOn(service, 'findByShortUrl').mockResolvedValue(url as any);

      const res = {
        redirect: jest.fn(),
      } as unknown as Response;

      await controller.redirectToOriginalUrl('shortUrl', res);
      expect(res.redirect).toHaveBeenCalledWith('http://example.com');
    });

    it('should throw a NotFoundException if URL is not found', async () => {
      jest.spyOn(service, 'findByShortUrl').mockImplementation(async (shortUrl: string) => {
        throw new NotFoundException('Url not found');
      });

      const res = {
        redirect: jest.fn(),
      } as unknown as Response;

      await expect(controller.redirectToOriginalUrl('shortUrl', res)).rejects.toThrow(NotFoundException);
    });
  });

  describe('listUrls', () => {
    it('should return a list of URLs for a user', async () => {
      const user = new UserEntity();
      const urls = [{}, {}];
      jest.spyOn(service, 'listUserUrls').mockResolvedValue(urls as any);

      const req = { user }  as unknown as  Request;
      const result = await controller.listUrls(req);
      expect(result).toBe(urls);
      expect(service.listUserUrls).toHaveBeenCalledWith(user);
    });
  });

  describe('update', () => {
    it('should update and return the URL', async () => {
      const user = new UserEntity();
      const url = { originalUrl: 'http://new-url.com' };
      jest.spyOn(service, 'updateUrl').mockResolvedValue(url as any);

      const req = { user }  as unknown as  Request;
      const result = await controller.update('some-id', 'http://new-url.com', req);
      expect(result).toBe(url);
      expect(service.updateUrl).toHaveBeenCalledWith('some-id', 'http://new-url.com', user);
    });

    it('should throw a NotFoundException if URL is not found', async () => {
      jest.spyOn(service, 'updateUrl').mockImplementation(async (id: string, newUrl: string, user: UserEntity) => {
        throw new NotFoundException('Url not found');
      });

      const req = { user: new UserEntity() }  as unknown as  Request;
      await expect(controller.update('some-id', 'http://new-url.com', req)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete the URL', async () => {
      const user = new UserEntity();
      jest.spyOn(service, 'deleteUrl').mockResolvedValue(undefined);

      const req = { user }  as unknown as  Request;
      const result = await controller.remove('some-id', req);
      expect(result).toEqual({ message: 'Url deleted successfully' });
      expect(service.deleteUrl).toHaveBeenCalledWith('some-id', user);
    });

    it('should throw a NotFoundException if URL is not found', async () => {
      jest.spyOn(service, 'deleteUrl').mockImplementation(async (id: string, user: UserEntity) => {
        throw new NotFoundException('Url not found');
      });

      const req = { user: new UserEntity() }  as unknown as  Request;
      await expect(controller.remove('some-id', req)).rejects.toThrow(NotFoundException);
    });
  });
});