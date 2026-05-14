import type { AdminEssayEditorValues } from './content-shared';

export const cloneFrontmatter = (value: AdminEssayEditorValues): AdminEssayEditorValues => ({
  title: value.title,
  description: value.description,
  date: value.date,
  publishedAt: value.publishedAt,
  tagsText: value.tagsText,
  draft: value.draft,
  archive: value.archive,
  slug: value.slug,
  cover: value.cover,
  badge: value.badge
});

export const isEqualFrontmatter = (
  left: AdminEssayEditorValues | null,
  right: AdminEssayEditorValues | null
): boolean =>
  JSON.stringify(left) === JSON.stringify(right);
