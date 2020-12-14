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
  readonly auth?: string;
}

export const httpClient = (config?: DevtoClientConfig): DevtoClient => ({
  createUserArticle: async dto => {
    await fetch('https://dev.to/api/articles', {
      method: 'POST',
      headers: { ...jsonContentHeader, ...authHeader(config?.auth) },
      body: JSON.stringify({ article: dto }),
    }).then(ensuresResponseOf<unknown>());
  },

  getArticle: async id => await fetch(`https://dev.to/api/articles/${id}`).then(ensuresResponseOf<ArticleDto>()),

  getUserArticles: async () => {
    const { username } = await getUser(config);
    return await fetch(`https://dev.to/api/articles?username=${username}`).then(ensuresResponseOf<ArticlesDto>());
  },

  updateArticle: async (id, dto) => {
    await fetch(`https://dev.to/api/articles/${id}`, {
      method: 'PUT',
      headers: { ...jsonContentHeader, ...authHeader(config?.auth) },
      body: JSON.stringify({ article: dto }),
    }).then(ensuresResponseOf<unknown>());
  },
});

let getUser = async (config?: DevtoClientConfig) => {
  const dto: UserDto = await fetch(`https://dev.to/api/users/me`, {
    headers: { ...jsonContentHeader, ...authHeader(config?.auth) },
  }).then(ensuresResponseOf<UserDto>());
  // Caches future calls.
  getUser = () => Promise.resolve(dto);
  return dto;
};

const authHeader = (apiKey: DevtoClientConfig['auth']) => ({ 'Api-Key': apiKey });
const jsonContentHeader = { 'Content-Type': 'application/json' };

const ensuresResponseOf = <T>() => async (res: Response): Promise<T> => {
  const body = await res.json().catch(() => null);
  if (res.ok) return body as T;
  if (!body) throw new Error(`Dev.to API request failed with ${res.status} (${res.statusText}).`);
  if (body.error) throw new Error(`Dev.to API request failed with ${res.status} (${res.statusText}): ${body.error}`);
};
