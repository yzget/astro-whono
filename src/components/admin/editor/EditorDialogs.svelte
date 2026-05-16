<script lang="ts">
import type { AdminEssayEditorValues } from '../../../lib/admin-console/content-shared';
import type { AdminContentIssue } from './essay-editor-client';
import ArticleInfoDialog from './ArticleInfoDialog.svelte';
import ImageInsertDialog from './ImageInsertDialog.svelte';

type Props = {
  frontmatter: AdminEssayEditorValues;
  frontmatterOpen: boolean;
  relativePath: string;
  issues: readonly AdminContentIssue[];
  disabled: boolean;
  frontmatterDirty: boolean;
  canSave: boolean;
  slugPlaceholder: string;
  imageInsertOpen: boolean;
  imageUploadEndpoint: string;
  entryId: string;
  onFrontmatterClose: () => void;
  onFrontmatterReset: () => void;
  onFrontmatterSave: () => void | Promise<void>;
  onImageClose: () => void;
  onImageInsert: (markdown: string) => void;
};

let {
  frontmatter = $bindable(),
  frontmatterOpen,
  relativePath,
  issues,
  disabled,
  frontmatterDirty,
  canSave,
  slugPlaceholder,
  imageInsertOpen,
  imageUploadEndpoint,
  entryId,
  onFrontmatterClose,
  onFrontmatterReset,
  onFrontmatterSave,
  onImageClose,
  onImageInsert
}: Props = $props();

let articleInfoDialog = $state<ArticleInfoDialog | null>(null);

export const captureReturnFocus = (trigger?: Element | null) => {
  articleInfoDialog?.captureReturnFocus(trigger);
};
</script>

<ArticleInfoDialog
  bind:this={articleInfoDialog}
  bind:value={frontmatter}
  open={frontmatterOpen}
  {relativePath}
  {issues}
  {disabled}
  dirty={frontmatterDirty}
  {canSave}
  {slugPlaceholder}
  onClose={onFrontmatterClose}
  onReset={onFrontmatterReset}
  onSave={onFrontmatterSave}
/>

<ImageInsertDialog
  open={imageInsertOpen}
  uploadEndpoint={imageUploadEndpoint}
  {entryId}
  {disabled}
  onClose={onImageClose}
  onInsert={onImageInsert}
/>
