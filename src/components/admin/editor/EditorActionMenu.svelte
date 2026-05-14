<script lang="ts">
import AdminEditorIcon from './AdminEditorIcon.svelte';
import type { StatusState } from './editor-shell-helpers';

type Props = {
  element: HTMLDivElement | null;
  statusText?: string;
  statusState?: StatusState;
  canWriteContent?: boolean;
  busy?: boolean;
  dirty?: boolean;
  returnHref: string;
  exportHref: string;
  onSave: () => void | Promise<void>;
  onReset: (event: MouseEvent) => void;
  onDownload: (event: MouseEvent) => void;
  onDelete: (event: MouseEvent) => void | Promise<void>;
};

let {
  element = $bindable(null),
  statusText = '',
  statusState = 'idle',
  canWriteContent = false,
  busy = false,
  dirty = false,
  returnHref,
  exportHref,
  onSave,
  onReset,
  onDownload,
  onDelete
}: Props = $props();
</script>

<div class="admin-editor-shell__top-actions" aria-label="文章操作" bind:this={element}>
  {#if statusText}
    <p class="admin-status admin-status--inline" data-state={statusState} role="status" aria-live="polite" aria-atomic="true">{statusText}</p>
  {/if}
  <button class="admin-btn admin-btn--secondary admin-btn--compact" type="button" onclick={() => void onSave()} disabled={!canWriteContent}>
    保存内容
  </button>
  <a class="admin-btn admin-btn--ghost admin-btn--compact" href={returnHref}>返回</a>
  <details class="admin-editor-shell__action-more">
    <summary class="admin-btn admin-btn--ghost admin-btn--compact admin-editor-shell__action-more-trigger" aria-label="更多文章操作">
      <span>更多</span>
      <AdminEditorIcon name="ellipsis" size={14} strokeWidth={2} />
    </summary>
    <div class="admin-content-menu-panel admin-editor-shell__action-menu" aria-label="更多文章操作">
      <button
        class="admin-content-menu-item"
        type="button"
        disabled={busy || !dirty}
        onclick={onReset}
      >
        <AdminEditorIcon name="rotate-ccw" size={14} strokeWidth={2} class="admin-icon" />
        <span>还原更改</span>
      </button>
      <a
        class="admin-content-menu-item"
        href={exportHref}
        download
        onclick={onDownload}
      >
        <AdminEditorIcon name="download" size={14} strokeWidth={2} class="admin-icon" />
        <span>下载文章</span>
      </a>
      <button
        class="admin-content-menu-item admin-content-menu-item--danger"
        type="button"
        disabled={busy}
        onclick={(event) => void onDelete(event)}
      >
        <AdminEditorIcon name="trash" size={14} strokeWidth={2} class="admin-icon" />
        <span>删除文章</span>
      </button>
    </div>
  </details>
</div>
