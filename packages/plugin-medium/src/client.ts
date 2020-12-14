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
  readonly auth?: string;
}

export const httpClient = (config?: MediumClientConfig): MediumClient => ({
  createUserPost: async (dto: CreatePostDto): Promise<void> => {
    const { id } = await getUser(config);
    await fetch(`https://api.medium.com/v1/users/${id}/posts`, {
      method: 'POST',
      headers: { ...jsonContentHeader, ...authHeader(config?.auth) },
      body: JSON.stringify(dto),
    }).then(ensuresDataResponseOf<unknown>());
  },

  getMedia: async id =>
    await fetch(`https://medium.com/media/${id}?format=json`).then(ensuresPayloadResponseOf<MediaDto>()),

  getPost: async id => await fetch(`https://medium.com/p/${id}?format=json`).then(ensuresPayloadResponseOf<PostDto>()),

  getUserPosts: async () => {
    const { username } = await getUser(config);
    return await fetch(`https://medium.com/@${username}?format=json`)
      .then(ensuresPayloadResponseOf<ProfileDto>())
      .then(user => Object.values(user.references.Post));
  },
});

let getUser = async (config?: MediumClientConfig): Promise<UserDto> => {
  const dto = await fetch('https://api.medium.com/v1/me', { headers: authHeader(config?.auth) }).then(
    ensuresDataResponseOf<UserDto>(),
  );
  // Caches future calls.
  getUser = () => Promise.resolve(dto);
  return dto;
};

const authHeader = (token: MediumClientConfig['auth']) => ({ Authorization: `Bearer ${token}` });
const jsonContentHeader = { 'Content-Type': 'application/json' };

const ensuresDataResponseOf = <T>() => async (res: Response): Promise<T> => {
  const body = await res.json().catch(() => null);
  if (res.ok) return body.data as T;
  if (!body) throw new Error(`Medium API request failed with ${res.status} (${res.statusText}).`);
  if (body.errors)
    throw new Error(`Medium API request failed with ${res.status} (${res.statusText}): ${body.errors.join(', ')}`);
};

const ensuresPayloadResponseOf = <T>() => async (res: Response): Promise<T> => {
  const body = await res
    .text()
    // Removes non JSON prefix i.e. `])}while(1);</x>`.
    .then(text => text.substr(text.indexOf('{')))
    .then(json => JSON.parse(json))
    .catch(null);
  if (res.ok && !!body?.success) return body.payload as T;
  if (!body) throw new Error(`Medium API request failed with ${res.status} (${res.statusText}).`);
  if (body.error) throw new Error(`Medium API request failed with ${res.status} (${res.statusText}): ${body.error}`);
};
