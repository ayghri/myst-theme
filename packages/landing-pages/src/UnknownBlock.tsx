import { MyST } from 'myst-to-react';
import { LandingBlock, type LandingBlockProps } from './LandingBlock.js';

export function UnknownBlock(props: Omit<LandingBlockProps, 'children'> & { blockName: string }) {
  const { node, blockName } = props;
  return (
    <LandingBlock {...props}>
      <div className="landing-unknown-container" role="alert">
        <div className="landing-unknown-header">
          Unknown block <span className="landing-unknown-block-name">{blockName}</span>
        </div>
        <div className="landing-unknown-content">
          <MyST ast={node} />
        </div>
      </div>
    </LandingBlock>
  );
}
