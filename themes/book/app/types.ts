import type { CommonTemplateOptions } from '@myst-theme/common';
export type TemplateOptions = CommonTemplateOptions & {
  hide_search?: boolean;
  hide_title_block?: boolean;
  remark42_url?: string;
  custom_js?: string;
};
