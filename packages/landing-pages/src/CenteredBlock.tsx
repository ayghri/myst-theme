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

export function CenteredBlock(props: Omit<LandingBlockProps, 'children'>) {
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
    return <InvalidBlock {...props} blockName="centered" />;
  }
  return (
    <LandingBlock {...props}>
      <div className="landing-centered-container">
        <div className="landing-centered-padding">
          {subtitle && (
            <p className="landing-centered-subtitle">
              <MyST ast={subtitle.children} />
            </p>
          )}
          {heading && (
            <BlockHeading node={heading} className="landing-centered-heading" />
          )}
          {body && (
            <div className="landing-centered-body">
              <MyST ast={body} />
            </div>
          )}
          {links && (
            <div className="landing-centered-links">
              <MyST ast={links} />
            </div>
          )}
        </div>
      </div>
    </LandingBlock>
  );
}

export const CENTERED_RENDERERS: NodeRenderers = {
  block: {
    'block[kind=centered]': CenteredBlock,
  },
};
