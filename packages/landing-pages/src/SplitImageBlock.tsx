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

export function SplitImageBlock(props: Omit<LandingBlockProps, 'children'>) {
  const { node } = props;
  const { image, body, links, subtitle, heading } = useMemo(() => {
    const { head, body: rawBody } = splitByHeader(node);

    const linksNode = selectAll('link,crossReference', rawBody);
    const subtitleNode = select('paragraph', head) as GenericParent | null;
    const headingNode = select('heading', head) as GenericParent | null;
    const imageNode = select('image', rawBody);
    const bodyNodes =
      filter(
        rawBody,
        (otherNode: GenericNode) =>
          !matches('link[class*=button], crossReference[class*=button], image', otherNode),
      )?.children ?? [];

    return {
      body: bodyNodes,
      image: imageNode,
      links: linksNode,
      subtitle: subtitleNode,
      heading: headingNode,
    };
  }, [node]);

  if (!image || !body) {
    return <InvalidBlock {...props} blockName="split-image" />;
  }

  return (
    <LandingBlock {...props}>
      <div className="landing-split-image-outer">
        <div className="landing-split-image-media">
          <MyST ast={image} />
        </div>
        <div className="landing-split-image-content-outer">
          <div className="landing-split-image-content-inner">
            {subtitle && (
              <p className="landing-split-image-subtitle">
                <MyST ast={subtitle.children} />
              </p>
            )}
            {heading && (
              <BlockHeading node={heading} className="landing-split-image-heading" />
            )}
            <div className="mt-6">
              <MyST ast={body} className="prose prose-invert" />
            </div>
            {links && (
              <div className="flex flex-row flex-wrap items-center gap-4 mt-8">
                <MyST ast={links} className="prose prose-invert" />
              </div>
            )}
          </div>
        </div>
      </div>
    </LandingBlock>
  );
}

export const SPLIT_IMAGE_RENDERERS: NodeRenderers = {
  block: {
    'block[kind=split-image]': SplitImageBlock,
  },
};
