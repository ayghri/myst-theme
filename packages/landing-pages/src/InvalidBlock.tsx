import { MyST } from 'myst-to-react';
import { LandingBlock, type LandingBlockProps } from './LandingBlock.js';

export function InvalidBlock(props: Omit<LandingBlockProps, 'children'> & { blockName: string }) {
  const { node, blockName } = props;
  return (
    <LandingBlock {...props}>
      <div className="landing-invalid-container" role="alert">
        <div className="landing-invalid-header">
          Invalid block <span className="landing-invalid-block-name">{blockName}</span>
        </div>
        <div className="landing-invalid-border">
          <div className="landing-invalid-message">
            <p>This '{blockName}' block does not conform to the expected AST structure.</p>
          </div>

          <div className="landing-invalid-content">
            <MyST ast={node.children} />
          </div>
        </div>
      </div>
    </LandingBlock>
  );
}
