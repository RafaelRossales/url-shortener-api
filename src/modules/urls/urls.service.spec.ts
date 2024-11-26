import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UrlEntity } from './entities/url.entity';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockUrlRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
});

describe('UrlsService', () => {
  let service: UrlsService;
  let repository: Repository<UrlEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: getRepositoryToken(UrlEntity),
          useFactory: mockUrlRepository,
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    repository = module.get<Repository<UrlEntity>>(getRepositoryToken(UrlEntity));
  });

  describe('shortUrl', () => {
    it('should create and save a short URL', async () => {
      const user = new UserEntity();
      const url = new UrlEntity();
      jest.spyOn(repository, 'create').mockReturnValue(url);
      jest.spyOn(repository, 'save').mockResolvedValue(url);

      const result = await service.shortUrl('http://example.com', user);
      expect(result).toBe(url);
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ originalUrl: 'http://example.com', user }));
      expect(repository.save).toHaveBeenCalledWith(url);
    });
  });

  describe('findByShortUrl', () => {
    it('should return a URL and increment clicks', async () => {
      const url = new UrlEntity();
      url.clicks = 0;
      jest.spyOn(repository, 'findOne').mockResolvedValue(url);
      jest.spyOn(repository, 'save').mockResolvedValue(url);

      const result = await service.findByShortUrl('shortUrl');
      expect(result).toBe(url);
      expect(url.clicks).toBe(1);
      expect(repository.save).toHaveBeenCalledWith(url);
    });

    it('should throw a NotFoundException if URL is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findByShortUrl('shortUrl')).rejects.toThrow(NotFoundException);
    });
  });

  describe('listUserUrls', () => {
    it('should return a list of URLs for a user', async () => {
      const user = new UserEntity();
      const urls = [new UrlEntity(), new UrlEntity()];
      jest.spyOn(repository, 'find').mockResolvedValue(urls);

      const result = await service.listUserUrls(user);
      expect(result).toBe(urls);
      expect(repository.find).toHaveBeenCalledWith({ where: { userId: user.id, deletedAt: null } });
    });
  });

  describe('updateUrl', () => {
    it('should update and return the URL', async () => {
      const user = new UserEntity();
      const url = new UrlEntity();
      jest.spyOn(repository, 'findOne').mockResolvedValue(url);
      jest.spyOn(repository, 'save').mockResolvedValue(url);

      const result = await service.updateUrl('some-id', 'http://new-url.com', user);
      expect(result).toBe(url);
      expect(url.originalUrl).toBe('http://new-url.com');
      expect(repository.save).toHaveBeenCalledWith(url);
    });

    it('should throw a NotFoundException if URL is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.updateUrl('some-id', 'http://new-url.com', new UserEntity())).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUrl', () => {
    it('should mark the URL as deleted', async () => {
      const user = new UserEntity();
      const url = new UrlEntity();
      jest.spyOn(repository, 'findOne').mockResolvedValue(url);
      jest.spyOn(repository, 'save').mockResolvedValue(url);

      await service.deleteUrl('some-id', user);
      expect(url.deletedAt).toBeInstanceOf(Date);
      expect(repository.save).toHaveBeenCalledWith(url);
    });

    it('should throw a NotFoundException if URL is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteUrl('some-id', new UserEntity())).rejects.toThrow(NotFoundException);
    });
  });
});