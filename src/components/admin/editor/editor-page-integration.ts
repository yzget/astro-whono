import { shouldGuardAdminNavigation } from '../../../scripts/admin-console/navigation-guard';
import { initAdminDetailsMenus } from '../../../scripts/admin-content/details-menu';

type Cleanup = () => void;

type EditorPageActionsPortalOptions = {
  actionsEl: HTMLElement | null;
  hostSelector: string;
  documentRoot?: Document;
};

type EditorDetailsMenusOptions = {
  selectors: string[];
  documentRoot?: Document;
};

type EditorNavigationGuardOptions = {
  isDirty: () => boolean;
  message: string;
  onBlocked: () => void;
  documentRoot?: Document;
  windowRef?: Window;
};

type ArticleInfoTriggerBindingOptions = {
  selector: string;
  onToggle: (trigger: HTMLButtonElement) => void;
  documentRoot?: Document;
};

type ArticleInfoTriggerSyncOptions = {
  selector: string;
  panelId: string;
  open: boolean;
  dirty: boolean;
  invalid: boolean;
  documentRoot?: Document;
};

type ElementInlineSizeObserverOptions = {
  element: HTMLElement | null;
  onInlineSize: (inlineSize: number) => void;
};

type QueuedElementInlineSizeReadOptions = {
  element: HTMLElement | null;
  fallbackInlineSize: number;
  existingFrame: number | null;
  onFrame: (frame: number | null) => void;
  onInlineSize: (inlineSize: number) => void;
  windowRef?: Window;
};

type AdminSidebarStateObserverOptions = {
  onChange: (expanded: boolean) => void;
  documentRoot?: Document;
};

type AdminSidebarCollapseOptions = {
  toggleId: string;
  documentRoot?: Document;
};

const noop = () => {};

const getDocumentRoot = (documentRoot?: Document): Document | null => {
  if (documentRoot) return documentRoot;
  return typeof document === 'undefined' ? null : document;
};

const getWindowRef = (windowRef?: Window): Window | null => {
  if (windowRef) return windowRef;
  return typeof window === 'undefined' ? null : window;
};

export const mountEditorPageActionsPortal = ({
  actionsEl,
  hostSelector,
  documentRoot
}: EditorPageActionsPortalOptions): Cleanup => {
  const root = getDocumentRoot(documentRoot);
  if (!root || !actionsEl) return noop;

  const host = root.querySelector<HTMLElement>(hostSelector);
  if (!host) return noop;

  const placeholder = root.createComment('admin-editor-page-actions');
  const originalParent = actionsEl.parentNode;
  const originalNextSibling = actionsEl.nextSibling;
  originalParent?.insertBefore(placeholder, actionsEl);
  host.append(actionsEl);

  return () => {
    if (placeholder.parentNode) {
      placeholder.replaceWith(actionsEl);
      return;
    }

    originalParent?.insertBefore(actionsEl, originalNextSibling);
  };
};

export const bindEditorDetailsMenus = ({
  selectors,
  documentRoot
}: EditorDetailsMenusOptions): Cleanup => {
  const root = getDocumentRoot(documentRoot);
  if (!root) return noop;

  const cleanups = selectors.map((selector) => initAdminDetailsMenus({
    selector,
    documentRoot: root
  }));

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
};

export const bindEditorNavigationGuard = ({
  isDirty,
  message,
  onBlocked,
  documentRoot,
  windowRef
}: EditorNavigationGuardOptions): Cleanup => {
  const root = getDocumentRoot(documentRoot);
  const win = getWindowRef(windowRef);
  if (!root || !win) return noop;

  const handleClick = (event: MouseEvent) => {
    const dirty = isDirty();
    if (!dirty) return;
    if (!(event.target instanceof Element)) return;

    const anchor = event.target.closest('a[href]');
    if (!(anchor instanceof HTMLAnchorElement)) return;

    if (
      !shouldGuardAdminNavigation({
        isDirty: dirty,
        currentUrl: win.location.href,
        nextUrl: anchor.href,
        button: event.button,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        target: anchor.target,
        download: anchor.hasAttribute('download')
      })
    ) {
      return;
    }

    if (win.confirm(message)) return;

    event.preventDefault();
    event.stopPropagation();
    onBlocked();
  };

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (!isDirty()) return;

    event.preventDefault();
    Reflect.set(event, 'returnValue', '');
  };

  root.addEventListener('click', handleClick, true);
  win.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    root.removeEventListener('click', handleClick, true);
    win.removeEventListener('beforeunload', handleBeforeUnload);
  };
};

export const bindArticleInfoTrigger = ({
  selector,
  onToggle,
  documentRoot
}: ArticleInfoTriggerBindingOptions): Cleanup => {
  const root = getDocumentRoot(documentRoot);
  if (!root) return noop;

  const handleClick = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest(selector);
    if (!(trigger instanceof HTMLButtonElement)) return;

    event.preventDefault();
    onToggle(trigger);
  };

  root.addEventListener('click', handleClick);

  return () => {
    root.removeEventListener('click', handleClick);
  };
};

export const syncArticleInfoTriggers = ({
  selector,
  panelId,
  open,
  dirty,
  invalid,
  documentRoot
}: ArticleInfoTriggerSyncOptions): void => {
  const root = getDocumentRoot(documentRoot);
  if (!root) return;

  const triggers = root.querySelectorAll<HTMLButtonElement>(selector);
  triggers.forEach((trigger) => {
    trigger.setAttribute('aria-controls', panelId);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    trigger.dataset.state = open ? 'open' : 'closed';
    trigger.dataset.dirty = dirty ? 'true' : 'false';
    trigger.dataset.invalid = invalid ? 'true' : 'false';
  });
};

export const observeElementInlineSize = ({
  element,
  onInlineSize
}: ElementInlineSizeObserverOptions): Cleanup => {
  if (!element || typeof ResizeObserver === 'undefined') return noop;

  const syncInlineSize = (nextInlineSize?: number) => {
    onInlineSize(nextInlineSize ?? element.getBoundingClientRect().width);
  };
  const observer = new ResizeObserver((entries) => {
    syncInlineSize(entries[0]?.contentRect.width);
  });

  syncInlineSize();
  observer.observe(element);
  return () => {
    observer.disconnect();
  };
};

export const queueElementInlineSizeRead = ({
  element,
  fallbackInlineSize,
  existingFrame,
  onFrame,
  onInlineSize,
  windowRef
}: QueuedElementInlineSizeReadOptions): void => {
  const win = getWindowRef(windowRef);
  if (!win) return;

  if (existingFrame !== null) {
    win.cancelAnimationFrame(existingFrame);
  }

  const frame = win.requestAnimationFrame(() => {
    onFrame(null);
    onInlineSize(element?.getBoundingClientRect().width ?? fallbackInlineSize);
  });
  onFrame(frame);
};

export const collapseAdminSidebarByToggle = ({
  toggleId,
  documentRoot
}: AdminSidebarCollapseOptions): boolean => {
  const root = getDocumentRoot(documentRoot);
  if (!root || root.documentElement.dataset.adminSidebar !== 'expanded') return false;

  const button = root.getElementById(toggleId);
  if (!(button instanceof HTMLButtonElement)) return false;

  button.click();
  return root.documentElement.getAttribute('data-admin-sidebar') === 'collapsed';
};

export const observeAdminSidebarExpandedState = ({
  onChange,
  documentRoot
}: AdminSidebarStateObserverOptions): Cleanup => {
  const root = getDocumentRoot(documentRoot);
  if (!root || typeof MutationObserver === 'undefined') return noop;

  const sync = () => {
    onChange(root.documentElement.dataset.adminSidebar === 'expanded');
  };
  sync();

  const observer = new MutationObserver(sync);
  observer.observe(root.documentElement, {
    attributes: true,
    attributeFilter: ['data-admin-sidebar']
  });

  return () => {
    observer.disconnect();
  };
};
