import { UserEntity } from "./entities/user.entity";
import { UrlEntity } from 'src/modules/urls/entities/url.entity';

describe('UserEntity', () => {
  let user: UserEntity;

  beforeEach(() => {
    user = new UserEntity();
    user.id = 'some-uuid';
    user.name = 'John Doe';
    user.email = 'john.doe@example.com';
    user.password = 'password';
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.deletedAt = null;
    user.urls = [];
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  it('should have the correct properties', () => {
    expect(user.id).toBe('some-uuid');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john.doe@example.com');
    expect(user.password).toBe('password');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user.deletedAt).toBeNull();
    expect(user.urls).toEqual([]);
  });

  it('should be able to add URLs', () => {
    const url = new UrlEntity();
    url.id = 'some-url-uuid';
    url.originalUrl = 'http://example.com';
    url.shortUrl = 'http://short.url';
    url.user = user;
    url.clicks = 0;
    url.createdAt = new Date();
    url.updatedAt = new Date();
    url.deletedAt = null;

    user.urls.push(url);

    expect(user.urls.length).toBe(1);
    expect(user.urls[0]).toBe(url);
  });
});