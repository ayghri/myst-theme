import { useGridSystemProvider, useReferences } from '@myst-theme/providers';
import classNames from 'classnames';
import { HashLink } from 'myst-to-react';
import { useState } from 'react';

export function Bibliography({
  containerClassName,
  innerClassName,
  hideLongBibliography = 15,
}: {
  containerClassName?: string;
  innerClassName?: string;
  hideLongBibliography?: false | number;
}) {
  const references = useReferences();
  const grid = useGridSystemProvider();
  const { order, data } = references?.cite ?? {};
  const filtered = order?.filter((l) => l);
  const [hidden, setHidden] = useState(true);
  if (!filtered || !data || filtered.length === 0) return null;
  const refs = hidden && hideLongBibliography ? filtered.slice(0, hideLongBibliography) : filtered;
  return (
    <section
      id="references"
      className={classNames(grid, 'myst-bibliography-section', containerClassName)}
    >
      <div className={innerClassName}>
        {!!hideLongBibliography && filtered.length > hideLongBibliography && (
          <button
            onClick={() => setHidden(!hidden)}
            className="myst-bibliography-toggle"
          >
            {hidden ? 'Show All' : 'Collapse'}
          </button>
        )}
        <header className="myst-bibliography-header">
          References
          <HashLink id="references" title="Link to References" hover className="ml-2" />
        </header>
      </div>
      <div
        className={classNames(
          'myst-bibliography-list',
          innerClassName,
        )}
      >
        <ol>
          {refs.map((label) => {
            const { html } = data[label];
            return (
              <li
                key={label}
                className="myst-bibliography-item"
                id={`cite-${label}`}
                dangerouslySetInnerHTML={{ __html: html || '' }}
              />
            );
          })}
          {!!hideLongBibliography && filtered.length > hideLongBibliography && (
            <li className="myst-bibliography-show">
              <button
                onClick={() => setHidden(!hidden)}
                className="myst-bibliography-show-button"
              >
                {hidden ? `Show all ${filtered.length} references` : 'Collapse references'}
              </button>
            </li>
          )}
        </ol>
      </div>
    </section>
  );
}
