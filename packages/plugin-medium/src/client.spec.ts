import fetchMock from 'jest-fetch-mock';
import { httpClient } from './client';
import { CreatePostDto } from './dtos/create-post-dto';

describe('client', () => {
  const userMock = JSON.stringify({
    data: {
      id: '146fbdca3f2e6afcb4a2ba49939a8ef0474ceb9aa963ac43a8f42924c4c77d115',
      username: 'maximegel',
      name: 'Maxime Gélinas',
      url: 'https://medium.com/@maximegel',
      imageUrl: 'https://cdn-images-1.medium.com/fit/c/400/400/1*JEU0eNCf1gIHPiKyCtwktQ.png',
    },
  });
  beforeEach(() => fetchMock.resetMocks());

  describe('createUserPost', () => {
    it('should not throw when api respond with success', async () => {
      const id = '000';
      const dto: CreatePostDto = {
        title: 'Some Post',
        contentFormat: 'markdown',
        content: 'Some content.',
      };
      const client = httpClient();
      fetchMock.mockResponses(userMock, JSON.stringify({ id, ...dto }));
      const req = client.createUserPost(dto);
      await expect(req).resolves.not.toThrow();
    });

    it('should throw when api respond with error', async () => {
      const message = 'Some error message.';
      const client = httpClient({ auth: '' });
      fetchMock.mockResponseOnce(JSON.stringify({ errors: [message] }), { status: 400 });
      const req = client.createUserPost({ title: 'Some Post', contentFormat: 'markdown', content: 'Some content.' });
      await expect(req).rejects.toThrow(`Medium API request failed with 400 (Bad Request): ${message}`);
    });

    it('should throw without message when api respond with error but no body', async () => {
      const client = httpClient({ auth: '' });
      fetchMock.mockResponseOnce(null, { status: 400 });
      const req = client.createUserPost({ title: 'Some Post', contentFormat: 'markdown', content: 'Some content.' });
      await expect(req).rejects.toThrow(`Medium API request failed with 400 (Bad Request).`);
    });
  });
});
