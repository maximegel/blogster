export interface PostFormatter {
  then(next: PostFormatter): PostFormatter;
  format(post: string): string;
}

export const createFormatter = (fn: (str: string) => string): PostFormatter => {
  const f: PostFormatter = {
    then: next => formatterChain(f).then(next),
    format: fn,
  };
  return f;
};

export const noopFormatter = createFormatter(str => str);

export const formatterChain = (...formatters: PostFormatter[]): PostFormatter => ({
  then: (next: PostFormatter) => formatterChain(...formatters, next),
  format: (post: string): string => formatters.reduce((result, next) => next.format(result), post),
});
