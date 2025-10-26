import type { NodeRenderer } from '@myst-theme/providers';
import { MyST } from './MyST.js';
import type { GenericNode } from 'myst-common';
import classNames from 'classnames';

type Aside = {
  type: 'aside';
};

function getAsideClass(kind?: string) {
  switch (kind) {
    case 'topic':
      return {
        container: 'myst-aside myst-aside-${kind}',
        title: 'myst-aside-title-${kind}',
        body: 'myst-aside-body-${kind}',
      };
    case 'margin':
    case 'sidebar':
    default:
      return {
        container: 'myst-aside myst-aside-${kind}',
        title: 'myst-aside-title',
        body: 'myst-aside-body',
      };
  }
}

export const AsideRenderer: NodeRenderer<Aside> = ({ node, className }) => {
  const [title, ...rest] = node.children as GenericNode[];
  const classes = getAsideClass(node.kind);
  if (title.type !== 'admonitionTitle') {
    return (
      <aside className={classNames(classes.container, node.class, className)}>
        <MyST ast={node.children} />
      </aside>
    );
  }
  return (
    <aside className={classNames(classes.container, node.class, className)}>
      <div className={classes.title}>
        <MyST ast={title} />
      </div>
      <div className={classes.body}>
        <MyST ast={rest} />
      </div>
    </aside>
  );
};

const ASIDE_RENDERERS = {
  aside: AsideRenderer,
};

export default ASIDE_RENDERERS;
