import fetch, { Response } from 'node-fetch';
import { ArticleDto } from './dtos/article-dto';
import { ArticlesDto } from './dtos/articles-dto';
import { CreateArticleDto } from './dtos/create-article-dto';
import { UpdateArticleDto } from './dtos/update-article-dto';
import { UserDto } from './dtos/user-dto';

export interface DevtoClient {
  createUserArticle(dto: CreateArticleDto): Promise<void>;
  getArticle(id: string | number): Promise<ArticleDto>;
  getUserArticles(): Promise<ArticlesDto>;
  updateArticle(id: string | number, dto: UpdateArticleDto): Promise<void>;
}
export interface DevtoClientConfig {
  readonly auth: string;
}

export const httpClient = (config: DevtoClientConfig): DevtoClient => ({
  createUserArticle: async dto => {
    await fetch('https://dev.to/api/articles', {
      method: 'POST',
      headers: { ...jsonContentHeader, ...authHeader(config.auth) },
      body: JSON.stringify({ article: dto }),
    })
      .then(ensuresSuccessfulStatus)
      .then(res => res.json())
      .then(body => data<unknown>(body));
  },

  getArticle: async id =>
    await fetch(`https://dev.to/api/articles/${id}`)
      .then(res => res.json())
      .then(body => data<ArticleDto>(body)),

  getUserArticles: async () => {
    const { username } = await getUser(config);
    return await fetch(`https://dev.to/api/articles?username=${username}`)
      .then(res => res.json())
      .then(body => data<ArticlesDto>(body));
  },

  updateArticle: async (id, dto) => {
    await fetch(`https://dev.to/api/articles/${id}`, {
      method: 'POST',
      headers: { ...jsonContentHeader, ...authHeader(config.auth) },
      body: JSON.stringify({ article: dto }),
    })
      .then(ensuresSuccessfulStatus)
      .then(res => res.json())
      .then(body => data<unknown>(body));
  },
});

let getUser = async (config: DevtoClientConfig) => {
  const dto: UserDto = await fetch(`https://dev.to/api/users/me`, {
    headers: { ...jsonContentHeader, ...authHeader(config.auth) },
  })
    .then(res => res.json())
    .then(body => data<UserDto>(body));
  // Caches future calls.
  getUser = () => Promise.resolve(dto);
  return dto;
};

const authHeader = (apiKey: DevtoClientConfig['auth']) => ({ 'Api-Key': apiKey });
const jsonContentHeader = { 'Content-Type': 'application/json' };

const data = <T>(body: Record<string, unknown>): T => {
  if (body.error) throw new Error(`Dev.to API request failed with message: ${body.error}`);
  return body as T;
};

const ensuresSuccessfulStatus = (res: Response): Response => {
  if (res.status >= 300) throw new Error(`Dev.to API request failed with status "${res.status}".`);
  return res;
};
