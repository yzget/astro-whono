import type { AdminEssayEditorValues } from '../../../lib/admin-console/content-shared';
import type { EditorOutlineEssaySourceItem } from './editor-outline-helpers';

export type EditorShellProps = {
  endpoint: string;
  exportEndpoint: string;
  deleteEndpoint: string;
  previewEndpoint: string;
  imageUploadEndpoint: string;
  returnHref: string;
  collection: 'essay';
  entryId: string;
  relativePath: string;
  defaultPublicSlug: string;
  revision: string;
  initialFrontmatter: AdminEssayEditorValues;
  initialBody: string;
  essayOutlineItems?: EditorOutlineEssaySourceItem[];
  initialArticleInfoOpen?: boolean;
};
