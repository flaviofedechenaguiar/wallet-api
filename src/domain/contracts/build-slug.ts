export interface IBuildSlug {
  build(text: string): string;
}

export const IBuildSlug = Symbol('IBuildSlug');
