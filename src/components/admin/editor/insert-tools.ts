import type { MarkdownInsertPlacement, MarkdownToolId } from './markdown-tools';

const MARKDOWN_MORE_SEPARATOR_TEXT = '<!-- more -->';

export type MarkdownMathInsertTool = {
  type: 'math';
  id: Extract<MarkdownToolId, 'inlineMath' | 'blockMath'>;
  label: string;
  icon: 'sigma' | 'square-sigma';
};

export type MarkdownDetailsInsertTool = {
  type: 'details';
  id: Extract<MarkdownToolId, 'details'>;
  label: string;
  icon: 'list-collapse';
  text: string;
  placement: Extract<MarkdownInsertPlacement, 'block'>;
};

export type MarkdownMoreSeparatorInsertTool = {
  type: 'moreSeparator';
  label: string;
  icon: 'separator-horizontal';
  text: string;
  placement: Extract<MarkdownInsertPlacement, 'block'>;
};

export const MARKDOWN_DETAILS_SUMMARY_PLACEHOLDER = '标题';
export const MARKDOWN_DETAILS_BODY_PLACEHOLDER = '内容';

export const buildMarkdownDetailsText = (
  body: string = MARKDOWN_DETAILS_BODY_PLACEHOLDER
): string =>
  [
    '<details>',
    `<summary>${MARKDOWN_DETAILS_SUMMARY_PLACEHOLDER}</summary>`,
    '',
    body,
    '</details>'
  ].join('\n');

export const MARKDOWN_MATH_INSERT_TOOLS: readonly MarkdownMathInsertTool[] = [
  { type: 'math', id: 'inlineMath', label: '行内公式', icon: 'sigma' },
  { type: 'math', id: 'blockMath', label: '块级公式', icon: 'square-sigma' }
] as const;

export const MARKDOWN_DETAILS_INSERT_TOOL: MarkdownDetailsInsertTool = {
  type: 'details',
  id: 'details',
  label: '折叠内容',
  icon: 'list-collapse',
  text: buildMarkdownDetailsText(),
  placement: 'block'
};

export const MARKDOWN_MORE_SEPARATOR_INSERT_TOOL: MarkdownMoreSeparatorInsertTool = {
  type: 'moreSeparator',
  label: '摘要分隔',
  icon: 'separator-horizontal',
  text: MARKDOWN_MORE_SEPARATOR_TEXT,
  placement: 'block'
};
