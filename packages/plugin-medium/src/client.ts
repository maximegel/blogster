import fetch, { Response } from 'node-fetch';
import { CreatePostDto } from './dtos/create-post-dto';
import { MediaDto } from './dtos/media-dto';
import { PostDto } from './dtos/post-dto';
import { ProfileDto } from './dtos/profile-dto';
import { ProfilePostDto } from './dtos/profile-post-dto';
import { UserDto } from './dtos/user-dto';

export interface MediumClient {
  createUserPost(dto: CreatePostDto): Promise<void>;
  getMedia(id: string | number): Promise<MediaDto>;
  getPost(id: string | number): Promise<PostDto>;
  getUserPosts(): Promise<ProfilePostDto[]>;
}
export interface MediumClientConfig {
  readonly auth: string;
}

export const httpClient = (config: MediumClientConfig): MediumClient => ({
  createUserPost: async (dto: CreatePostDto): Promise<void> => {
    const { id } = await getUser(config);
    await fetch(`https://api.medium.com/v1/users/${id}/posts`, {
      method: 'POST',
      headers: { ...jsonContentHeader, ...authHeader(config.auth) },
      body: JSON.stringify(dto),
    })
      .then(res => res.json())
      .then(body => data<unknown>(body));
  },

  getMedia: async id =>
    await fetch(`https://medium.com/media/${id}?format=json`)
      .then(brokenJson)
      .then(res => payload<MediaDto>(res)),

  getPost: async id =>
    await fetch(`https://medium.com/p/${id}?format=json`)
      .then(res => brokenJson(res))
      .then(body => payload<PostDto>(body)),

  getUserPosts: async () => {
    const { username } = await getUser(config);
    return await fetch(`https://medium.com/@${username}?format=json`)
      .then(brokenJson)
      .then(body => payload<ProfileDto>(body))
      .then(user => Object.values(user.references.Post));
  },
});

let getUser = async (config: MediumClientConfig): Promise<UserDto> => {
  const dto = await fetch('https://api.medium.com/v1/me', { headers: authHeader(config.auth) })
    .then(res => res.json())
    .then(body => data<UserDto>(body));
  // Caches future calls.
  getUser = () => Promise.resolve(dto);
  return dto;
};

const authHeader = (token: MediumClientConfig['auth']) => ({ Authorization: `Bearer ${token}` });
const jsonContentHeader = { 'Content-Type': 'application/json' };

const data = <T>(body: unknown): T => {
  const { errors, data } = body as DataBody<T>;
  if (errors) throw new Error(`Medium API request failed with message(s): ` + errors.join(', '));
  return data;
};
type DataBody<T> = { errors: { message: string; code: string }[]; data: T };

const payload = <T = Record<string, unknown>>(body: unknown): T => {
  const { success, error, payload } = body as PayloadBody<T>;
  if (!success) throw new Error(`Medium API request failed with message: ${error}`);
  return payload;
};
type PayloadBody<T> = { success: boolean; error?: string; payload: T };

const brokenJson = (res: Response): Promise<unknown> =>
  res
    .text()
    // Removes non JSON prefix i.e. `])}while(1);</x>`.
    .then(text => text.substr(text.indexOf('{')))
    .then(json => JSON.parse(json));
