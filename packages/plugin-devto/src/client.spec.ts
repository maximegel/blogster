import fetchMock from 'jest-fetch-mock';
import { httpClient } from './client';

describe('client', () => {
  beforeEach(() => fetchMock.resetMocks());

  describe('createUserArticle', () => {
    it('should not throw when api respond with success', async () => {
      const id = '000';
      const dto = {
        title: 'Some Post',
        body_markdown: 'Some content.',
      };
      const client = httpClient();
      fetchMock.mockResponseOnce(JSON.stringify({ id, ...dto }));
      const req = client.createUserArticle(dto);
      await expect(req).resolves.not.toThrow();
    });

    it('should throw when api respond with error', async () => {
      const message = 'Some error message.';
      const client = httpClient();
      fetchMock.mockResponseOnce(JSON.stringify({ error: message }), { status: 400 });
      const req = client.createUserArticle({ title: 'Some Post', body_markdown: 'Some content.' });
      await expect(req).rejects.toThrow(`Dev.to API request failed with 400 (Bad Request): ${message}`);
    });

    it('should throw without message when api respond with error but no body', async () => {
      const client = httpClient();
      fetchMock.mockResponseOnce(null, { status: 400 });
      const req = client.createUserArticle({ title: 'Some Post', body_markdown: 'Some content.' });
      await expect(req).rejects.toThrow(`Dev.to API request failed with 400 (Bad Request).`);
    });
  });

  describe('update', () => {
    it('should not throw when api respond with success', async () => {
      const id = '000';
      const dto = {
        title: 'Some Post',
        body_markdown: 'Some content.',
      };
      const client = httpClient();
      fetchMock.mockResponseOnce(JSON.stringify({ id, ...dto }));
      const req = client.updateArticle(id, dto);
      await expect(req).resolves.not.toThrow();
    });

    it('should throw when api respond with error', async () => {
      const message = 'Some error message.';
      const client = httpClient();
      fetchMock.mockResponseOnce(JSON.stringify({ error: message }), { status: 400 });
      const req = client.updateArticle('000', { title: 'Some Post', body_markdown: 'Some content.' });
      await expect(req).rejects.toThrow(`Dev.to API request failed with 400 (Bad Request): ${message}`);
    });

    it('should throw without message when api respond with error but no body', async () => {
      const client = httpClient();
      fetchMock.mockResponseOnce(null, { status: 400 });
      const req = client.updateArticle('000', { title: 'Some Post', body_markdown: 'Some content.' });
      await expect(req).rejects.toThrow(`Dev.to API request failed with 400 (Bad Request).`);
    });
  });
});
