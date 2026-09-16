import type { CSSProperties } from 'react';

/** CSS custom properties as inline style — React's types only know real properties. */
export function vars(values: Record<`--${string}`, string | number>): CSSProperties {
  return values as CSSProperties;
}

export const delay = (ms: number) => vars({ '--delay': `${ms}ms` });
