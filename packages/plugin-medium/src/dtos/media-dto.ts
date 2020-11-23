export interface MediaDto {
  readonly value: {
    readonly mediaResourceId: string;
    readonly href: string;
    readonly domain: string;
    readonly gist?: {
      readonly gistId: string;
      readonly gistScriptUrl: string;
    };
  };
  readonly references: Record<string, unknown>;
}
