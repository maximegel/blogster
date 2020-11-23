import _ from 'lodash';
import { Post } from '../post';
import { createMetadataProcessor, PostProcessor } from '../post-processor';

function arrangeLike<T extends Record<string, unknown>>(initial: T, other: T): T {
  function rec(initial: unknown, other: unknown): unknown {
    if (_.isPlainObject(initial) && _.isPlainObject(other))
      return _.keys(other)
        .concat(_.difference(_.keys(initial), _.keys(other)))
        .reduce((result, key) => ({ ...result, [key]: rec(initial[key], other[key]) }), {});
    if (_.isArray(initial) && _.isArray(other)) {
      return _.intersection(other, initial)
        .concat(_.difference(initial, other))
        .reduce(
          (result, val) => [
            ...result,
            rec(
              val,
              other.find(v => v === val),
            ),
          ],
          [],
        );
    } else return initial;
  }
  return rec(initial, other) as T;
}

export const arrangeMetadataLike = (other: Post): PostProcessor =>
  createMetadataProcessor(metadata => arrangeLike(metadata, other.body.metadata));
