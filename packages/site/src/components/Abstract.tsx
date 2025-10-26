import type { GenericParent } from 'myst-common';
import { MyST, HashLink } from 'myst-to-react';

export function Abstract({
  content,
  title = 'Abstract',
  id = 'abstract',
  className,
}: {
  title?: string;
  id?: string;
  content?: GenericParent;
  className?: string;
}) {
  if (!content) return null;
  return (
    <div className={className}>
      <h2 id={id} className="myst-abstract-heading">
        {title}
        <HashLink id={id} title={`Link to ${title}`} hover className="ml-2" />
      </h2>
      <div className="myst-abstract-content">
        <MyST ast={content} className="col-body" />
      </div>
    </div>
  );
}
