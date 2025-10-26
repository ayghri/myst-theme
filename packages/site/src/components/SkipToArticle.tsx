import React, { useCallback } from 'react';

function makeSkipClickHandler(hash: string) {
  return (e: React.UIEvent<HTMLElement, Event>) => {
    e.preventDefault();
    const el = document.querySelector(`#${hash}`) as HTMLElement;
    if (!el) return;
    (el.nextSibling as HTMLElement).focus();
    history.replaceState(undefined, '', `#${hash}`);
    // Changes keyboard tab-index location
    if (el.tabIndex === -1) el.tabIndex = -1;
    el.focus({ preventScroll: true });
  };
}

/**
 * @deprecated use `SkipTo` instead with a list of targets
 *
 */
export function SkipToArticle({
  frontmatter = true,
  article = true,
}: {
  frontmatter?: boolean;
  article?: boolean;
}) {
  const fm = 'skip-to-frontmatter';
  const art = 'skip-to-article';

  const frontmatterHandler = useCallback(() => makeSkipClickHandler(fm), [frontmatter]);
  const articleHandler = useCallback(() => makeSkipClickHandler(art), [article]);
  return (
    <div
      className="myst-skip-container"
      aria-label="skip to content options"
    >
      {frontmatter && (
        <a
          href={`#${fm}`}
          className="myst-skip-link"
          onClick={frontmatterHandler}
        >
          Skip to article frontmatter
        </a>
      )}
      {article && (
        <a
          href={`#${art}`}
          className="myst-skip-link"
          onClick={articleHandler}
        >
          Skip to article content
        </a>
      )}
    </div>
  );
}

/**
 * Add a skip navigation unit with links based on a list of targets
 */
export const SkipTo = React.memo(({ targets }: { targets: { id: string; title: string }[] }) => {
  return (
    <div
      className="myst-skip-container"
      aria-label="skip to content options"
    >
      {targets.map(({ id, title }) => (
        <a
          key={id}
          href={`#${id}`}
          className="myst-skip-link"
          onClick={makeSkipClickHandler(id)}
        >
          {title}
        </a>
      ))}
    </div>
  );
});
