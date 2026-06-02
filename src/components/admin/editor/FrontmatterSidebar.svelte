<script lang="ts">
import type { AdminEssayEditorValues } from '../../../lib/admin-console/content-shared';
import AdminEditorIcon from './AdminEditorIcon.svelte';

type AdminContentIssue = {
  path: string;
  message: string;
};

type Props = {
  value: AdminEssayEditorValues;
  issues?: readonly AdminContentIssue[];
  disabled?: boolean;
  slugPlaceholder?: string;
};

let {
  value = $bindable(),
  issues = [],
  disabled = false,
  slugPlaceholder = ''
}: Props = $props();

const getIssue = (path: string): string =>
  issues.find((issue) => issue.path === path)?.message ?? '';
</script>

<aside class="admin-editor-frontmatter" aria-label="随笔字段">
  <div class="admin-editor-frontmatter__fields">
    <label class="admin-field admin-content-editor__field" class:is-invalid={Boolean(getIssue('title'))}>
      <span class="admin-field__label">文章标题</span>
      <input class="admin-field__control" name="title" type="text" bind:value={value.title} {disabled} />
      <p class="admin-content-editor__error" hidden={!getIssue('title')}>{getIssue('title')}</p>
    </label>

    <div class="admin-editor-frontmatter__datetime-grid">
      <div class="admin-field admin-content-editor__field" class:is-invalid={Boolean(getIssue('date'))}>
        <label class="admin-field__label" for="admin-essay-date">发布日期</label>
        <input id="admin-essay-date" class="admin-field__control" name="date" type="date" bind:value={value.date} {disabled} />
        <p class="admin-content-editor__error" hidden={!getIssue('date')}>{getIssue('date')}</p>
      </div>

      <div class="admin-field admin-content-editor__field" class:is-invalid={Boolean(getIssue('publishedAt'))}>
        <div class="admin-editor-frontmatter__label-row">
          <label class="admin-field__label" for="admin-essay-published-at">详细时间（可选）</label>
          <button
            class="admin-editor-frontmatter__hint-trigger"
            type="button"
            aria-label="详细时间说明"
            aria-describedby="admin-essay-published-at-tip"
          >
            <AdminEditorIcon name="info" size={13} strokeWidth={2} />
          </button>
          <span id="admin-essay-published-at-tip" class="admin-editor-frontmatter__tooltip" role="tooltip">
            按 ISO 格式填写，需包含时区；留空时仅使用发布日期。
          </span>
        </div>
        <input
          id="admin-essay-published-at"
          class="admin-field__control"
          name="publishedAt"
          type="text"
          bind:value={value.publishedAt}
          placeholder="2024-11-23T18:00:00+08:00"
          aria-describedby="admin-essay-published-at-tip"
          {disabled}
        />
        <p class="admin-content-editor__error" hidden={!getIssue('publishedAt')}>{getIssue('publishedAt')}</p>
      </div>
    </div>

    <label class="admin-field admin-content-editor__field" class:is-invalid={Boolean(getIssue('badge'))}>
      <span class="admin-field__label">badge</span>
      <input class="admin-field__control" name="badge" type="text" bind:value={value.badge} {disabled} />
      <p class="admin-content-editor__error" hidden={!getIssue('badge')}>{getIssue('badge')}</p>
    </label>

    <label class="admin-field admin-content-editor__field" class:is-invalid={Boolean(getIssue('description'))}>
      <span class="admin-field__label">摘要</span>
      <textarea class="admin-field__control" name="description" bind:value={value.description} rows="3" {disabled}></textarea>
      <p class="admin-content-editor__error" hidden={!getIssue('description')}>{getIssue('description')}</p>
    </label>

    <label class="admin-field admin-content-editor__field" class:is-invalid={Boolean(getIssue('slug'))}>
      <span class="admin-field__label">自定义路径</span>
      <input class="admin-field__control" name="slug" type="text" bind:value={value.slug} placeholder={slugPlaceholder} spellcheck="false" {disabled} />
      <p class="admin-content-editor__error" hidden={!getIssue('slug')}>{getIssue('slug')}</p>
    </label>

    <label class="admin-field admin-content-editor__field" class:is-invalid={Boolean(getIssue('cover'))}>
      <span class="admin-field__label">封面图</span>
      <input class="admin-field__control" name="cover" type="text" bind:value={value.cover} spellcheck="false" {disabled} />
      <p class="admin-content-editor__error" hidden={!getIssue('cover')}>{getIssue('cover')}</p>
    </label>

    <label class="admin-field admin-content-editor__field" class:is-invalid={Boolean(getIssue('tags'))}>
      <span class="admin-field__label">标签（每行一个）</span>
      <textarea class="admin-field__control" name="tags" bind:value={value.tagsText} rows="3" spellcheck="false" {disabled}></textarea>
      <p class="admin-content-editor__error" hidden={!getIssue('tags')}>{getIssue('tags')}</p>
    </label>
  </div>
</aside>
