import type { ReactNode } from 'react';
import type { GenericParent } from 'myst-common';

import { useGridSystemProvider } from '@myst-theme/providers';
import classNames from 'classnames';

export type LandingBlockProps = {
  node: GenericParent;
  className?: string;
  children: ReactNode;
};

export function LandingBlock({ node, className, children }: LandingBlockProps) {
  const grid = useGridSystemProvider();
  const { key } = node;

  const externalClassNames = classNames(className, node.class);
  const subGrid = node.visibility === 'hide' ? '' : `${grid} subgrid-gap col-page [&>*]:col-page`;

  return (
    <div
      key={`block-${key}`}
      id={key}
      className={classNames('landing-block', externalClassNames, {
        // Hide the subgrid if either the dataClass or the className exists and includes `col-`
        [subGrid]: !(externalClassNames && externalClassNames.includes('col-')),
        'landing-block-hidden': node.visibility === 'remove',
      })}
    >
      {children}
    </div>
  );
}
