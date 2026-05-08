import {
  ADMIN_CONTENT_COLLECTION_KEYS,
  isAdminContentCollectionKey,
  type AdminContentCollectionKey
} from './content-collections';

export type AdminContentScopeKey = 'all' | AdminContentCollectionKey;

export const ADMIN_CONTENT_COLLECTIONS = ADMIN_CONTENT_COLLECTION_KEYS;

export const ADMIN_CONTENT_SCOPE_OPTIONS = [
  { value: 'all', label: '全部内容' },
  { value: 'essay', label: '随笔' },
  { value: 'bits', label: '絮语' },
  { value: 'memo', label: '小记' }
] as const satisfies readonly { value: AdminContentScopeKey; label: string }[];

export const ADMIN_CONTENT_OVERVIEW_SECTION_LIMIT = 8;
export const ADMIN_CONTENT_COLLECTION_PAGE_SIZE = 20;

export const isAdminContentScopeKey = (value: string): value is AdminContentScopeKey =>
  value === 'all' || isAdminContentCollectionKey(value);

export {
  isAdminContentCollectionKey
};
export type {
  AdminContentCollectionKey
};

const encodeEntryIdPath = (entryId: string): string =>
  entryId
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

export const getAdminContentEntryEditHref = (
  collection: AdminContentCollectionKey,
  entryId: string
): string =>
  `/admin/content/${collection}/_edit/${encodeEntryIdPath(entryId)}/`;

export const getAdminContentEntryListHref = (
  collection: AdminContentCollectionKey,
  options: { entryId?: string | null } = {}
): string => {
  // 列表定位使用 query 参数承载源文件身份，避免和已移除的 collection 列表路由重新绑定。
  const params = new URLSearchParams({ collection });
  const entryId = options.entryId?.trim() ?? '';
  if (entryId) params.set('entryId', entryId);
  return `/admin/content/?${params.toString()}`;
};
