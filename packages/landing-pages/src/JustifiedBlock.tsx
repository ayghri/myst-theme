import { useMemo } from 'react';
import type { GenericParent, GenericNode } from 'myst-common';
import { MyST } from 'myst-to-react';

import { select, selectAll, matches } from 'unist-util-select';
import { filter } from 'unist-util-filter';
import type { NodeRenderers } from '@myst-theme/providers';

import { InvalidBlock } from './InvalidBlock.js';
import { BlockHeading } from './BlockHeading.js';
import { splitByHeader } from './utils.js';
import { LandingBlock, type LandingBlockProps } from './LandingBlock.js';

export function JustifiedBlock(props: Omit<LandingBlockProps, 'children'>) {
  const { node } = props;

  const { body, links, subtitle, heading } = useMemo(() => {
    const { head, body: rawBody } = splitByHeader(node);

    const linksNode = selectAll('link[class*=button], crossReference[class*=button]', rawBody);
    const subtitleNode = select('paragraph', head) as GenericParent | null;
    const headingNode = select('heading', head) as GenericParent | null;
    const bodyNodes =
      filter(
        rawBody,
        (otherNode: GenericNode) =>
          !matches('link[class*=button], crossReference[class*=button]', otherNode),
      )?.children ?? [];

    return {
      body: bodyNodes,
      links: linksNode,
      subtitle: subtitleNode,
      heading: headingNode,
    };
  }, [node]);

  if (!body) {
    return <InvalidBlock {...props} blockName="justified" />;
  }
  return (
    <LandingBlock {...props}>
      <div className="landing-justified-grid grid-areas-just-narrow md:grid-areas-just-wide">
        {subtitle && (
          <p className="landing-justified-subtitle grid-area-subtitle">
            <MyST ast={subtitle.children} />
          </p>
        )}
        {heading && (
          <BlockHeading node={heading} className="landing-justified-heading grid-area-title" />
        )}
        {body && (
          <div className="landing-justified-body grid-area-body">
            <MyST ast={body} />
          </div>
        )}
        {links && (
          <div className="landing-justified-links grid-area-links">
            <MyST ast={links} />
          </div>
        )}
      </div>
    </LandingBlock>
  );
}

export const JUSTIFIED_RENDERERS: NodeRenderers = {
  block: {
    'block[kind=justified]': JustifiedBlock,
  },
};
