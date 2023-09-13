import { IBuildSlug } from 'src/domain/contracts/build-slug';
import slugify from 'slugify';

export class SlugifyBuildSlug implements IBuildSlug {
  build(text: string): string {
    return slugify(text);
  }
}
