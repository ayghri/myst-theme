import { useGridSystemProvider, useReferences } from '@myst-theme/providers';
import classNames from 'classnames';
import type { GenericNode } from 'myst-common';
import type { FootnoteDefinition, FootnoteReference } from 'myst-spec-ext';
import { HashLink, MyST } from 'myst-to-react';
import { selectAll } from 'unist-util-select';

export function Footnotes({
  containerClassName,
  innerClassName,
}: {
  containerClassName?: string;
  innerClassName?: string;
}) {
  const references = useReferences();
  const grid = useGridSystemProvider();
  const defs = selectAll('footnoteDefinition', references?.article) as FootnoteDefinition[];
  const refs = selectAll('footnoteReference', references?.article) as FootnoteReference[];
  if (defs.length === 0) return null;
  return (
    <section
      id="footnotes"
      className={classNames(grid, 'myst-footnotes-section', containerClassName)}
    >
      <div className={innerClassName}>
        <header className="myst-footnotes-header">
          Footnotes
          <HashLink id="footnotes" title="Link to Footnotes" hover className="ml-2" />
        </header>
      </div>
      <div
        className={classNames(
          'myst-footnotes-list',
          innerClassName,
        )}
      >
        <ol>
          {defs.map((fn) => {
            return (
              <li key={(fn as GenericNode).key} id={`fn-${fn.identifier}`} className="myst-footnotes-item">
                <div className="myst-footnotes-item-row">
                  <div className="myst-footnotes-item-content">
                    <MyST ast={fn.children} />
                  </div>
                  <div className="myst-footnotes-item-links">
                    {refs
                      .filter((ref) => ref.identifier === fn.identifier)
                      .map((ref) => (
                        <HashLink
                          key={(ref as GenericNode).key}
                          id={`fnref-${(ref as GenericNode).key}`}
                          title="Link to Content"
                          hover="desktop"
                          className="myst-footnotes-back-link"
                          children="↩"
                          scrollBehavior="instant"
                        />
                      ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
