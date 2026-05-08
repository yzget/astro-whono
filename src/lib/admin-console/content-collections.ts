export type AdminContentCollectionKey = 'essay' | 'bits' | 'memo';
export type AdminContentWriteCollectionKey = 'essay' | 'bits';

export const ADMIN_CONTENT_COLLECTION_KEYS = ['essay', 'bits', 'memo'] as const satisfies readonly AdminContentCollectionKey[];
export const ADMIN_CONTENT_WRITE_COLLECTION_KEYS = ['essay', 'bits'] as const satisfies readonly AdminContentWriteCollectionKey[];

export const isAdminContentCollectionKey = (value: string): value is AdminContentCollectionKey =>
  (ADMIN_CONTENT_COLLECTION_KEYS as readonly string[]).includes(value);

export const isAdminContentWriteCollectionKey = (value: string): value is AdminContentWriteCollectionKey =>
  (ADMIN_CONTENT_WRITE_COLLECTION_KEYS as readonly string[]).includes(value);
