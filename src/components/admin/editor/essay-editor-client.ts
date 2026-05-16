import type { AdminEssayEditorValues } from '../../../lib/admin-console/content-shared';
import {
  getPayloadDeleteResult,
  getPayloadErrors,
  getPayloadEssayBody,
  getPayloadEssayValues,
  getPayloadIssues,
  getPayloadPreviewResult,
  getPayloadResult,
  getPayloadRevision,
  isPayloadOk,
  parseResponseBody,
  type AdminContentDeleteResult,
  type AdminContentIssue,
  type AdminContentPreviewResult,
  type AdminContentWriteResult
} from '../../../scripts/admin-content/entry-transport';

export type {
  AdminContentDeleteResult,
  AdminContentIssue,
  AdminContentPreviewResult,
  AdminContentWriteResult
};

type FetchLike = typeof fetch;

type EssayEditorRequestOutcome = {
  responseOk: boolean;
  status: number;
  payloadOk: boolean;
  revision: string | null;
  errors: string[];
  issues: AdminContentIssue[];
};

export type EssayEditorSaveInput = {
  endpoint: string;
  collection: 'essay';
  entryId: string;
  revision: string;
  frontmatter: AdminEssayEditorValues;
  body?: string;
  fetchImpl?: FetchLike;
};

export type EssayEditorSaveOutcome = EssayEditorRequestOutcome & {
  result: AdminContentWriteResult | null;
  latestValues: AdminEssayEditorValues | null;
  latestBody: string | null;
};

export type EssayEditorPreviewInput = {
  endpoint: string;
  collection: 'essay';
  entryId: string;
  source: string;
  signal?: AbortSignal;
  fetchImpl?: FetchLike;
};

export type EssayEditorPreviewOutcome = Omit<EssayEditorRequestOutcome, 'revision' | 'issues'> & {
  result: AdminContentPreviewResult | null;
};

export type EssayEditorDeleteInput = {
  endpoint: string;
  collection: 'essay';
  entryId: string;
  revision: string;
  expectedRelativePath: string;
  fetchImpl?: FetchLike;
};

export type EssayEditorDeleteOutcome = EssayEditorRequestOutcome & {
  result: AdminContentDeleteResult | null;
};

const JSON_REQUEST_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8'
} as const;

const getFetch = (fetchImpl?: FetchLike): FetchLike => fetchImpl ?? fetch;

export const saveEssayEntry = async ({
  endpoint,
  collection,
  entryId,
  revision,
  frontmatter,
  body,
  fetchImpl
}: EssayEditorSaveInput): Promise<EssayEditorSaveOutcome> => {
  const response = await getFetch(fetchImpl)(endpoint, {
    method: 'POST',
    headers: JSON_REQUEST_HEADERS,
    cache: 'no-store',
    body: JSON.stringify({
      collection,
      entryId,
      revision,
      frontmatter,
      ...(body !== undefined ? { body } : {})
    })
  });
  const payload = await parseResponseBody(response);

  return {
    responseOk: response.ok,
    status: response.status,
    payloadOk: isPayloadOk(payload),
    revision: getPayloadRevision(payload),
    errors: getPayloadErrors(payload),
    issues: getPayloadIssues(payload),
    result: getPayloadResult(payload),
    latestValues: getPayloadEssayValues(payload),
    latestBody: getPayloadEssayBody(payload)
  };
};

export const renderEssayPreview = async ({
  endpoint,
  collection,
  entryId,
  source,
  signal,
  fetchImpl
}: EssayEditorPreviewInput): Promise<EssayEditorPreviewOutcome> => {
  const requestInit: RequestInit = {
    method: 'POST',
    headers: JSON_REQUEST_HEADERS,
    cache: 'no-store',
    body: JSON.stringify({
      collection,
      entryId,
      source
    })
  };
  if (signal) requestInit.signal = signal;

  const response = await getFetch(fetchImpl)(endpoint, requestInit);
  const payload = await parseResponseBody(response);

  return {
    responseOk: response.ok,
    status: response.status,
    payloadOk: isPayloadOk(payload),
    errors: getPayloadErrors(payload),
    result: getPayloadPreviewResult(payload)
  };
};

export const deleteEssayEntry = async ({
  endpoint,
  collection,
  entryId,
  revision,
  expectedRelativePath,
  fetchImpl
}: EssayEditorDeleteInput): Promise<EssayEditorDeleteOutcome> => {
  const response = await getFetch(fetchImpl)(endpoint, {
    method: 'POST',
    headers: JSON_REQUEST_HEADERS,
    cache: 'no-store',
    body: JSON.stringify({
      collection,
      entryId,
      revision,
      expectedRelativePath
    })
  });
  const payload = await parseResponseBody(response);

  return {
    responseOk: response.ok,
    status: response.status,
    payloadOk: isPayloadOk(payload),
    revision: getPayloadRevision(payload),
    errors: getPayloadErrors(payload),
    issues: getPayloadIssues(payload),
    result: getPayloadDeleteResult(payload)
  };
};
