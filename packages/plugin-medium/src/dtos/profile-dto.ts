import { ProfilePostDto } from './profile-post-dto';

export interface ProfileDto {
  readonly references: {
    readonly Post: {
      readonly [id: string]: ProfilePostDto;
    };
  };
}
