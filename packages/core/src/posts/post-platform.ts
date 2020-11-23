export interface PostPlatform {
  readonly name: string;
}

export const platformEquals = (platform: PostPlatform, other: PostPlatform): boolean => platform.name === other.name;
