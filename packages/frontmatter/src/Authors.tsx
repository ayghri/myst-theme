import React from 'react';
import classNames from 'classnames';
import type { PageFrontmatter } from 'myst-frontmatter';
import { OrcidIcon, EmailIcon } from '@scienceicons/react/24/solid';
import { AuthorPopover } from './AuthorPopover.js';
import { Affiliation } from './Affiliations.js';

function AuthorIconLink({
  href,
  icon: Icon,
  title,
  className,
}: {
  href: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  className?: string;
}) {
  return (
    <a className="myst-fm-author-icon-link" href={href} title={title} target="_blank" rel="noopener noreferrer">
      <Icon
        width="1rem"
        height="1rem"
        className={classNames('myst-fm-author-icon', className)}
      />
    </a>
  );
}

export function Author({
  author,
  affiliations,
  className,
}: {
  author: Required<PageFrontmatter>['authors'][0];
  affiliations: PageFrontmatter['affiliations'];
  className?: string;
}) {
  return (
    <span className={classNames('myst-fm-author', className)}>
      <AuthorPopover author={author} affiliations={affiliations}>
        {author.name}
      </AuthorPopover>
      {author.email && author.corresponding && (
        <AuthorIconLink
          href={`mailto:${author.email}`}
          title={`${author.name} <${author.email}>`}
          icon={EmailIcon}
          className="myst-fm-author-icon-email"
        />
      )}
      {author.orcid && (
        <AuthorIconLink
          href={`https://orcid.org/${author.orcid}`}
          title={`ORCID: ${author.orcid}`}
          icon={OrcidIcon}
          className="myst-fm-author-icon-orcid"
        />
      )}
    </span>
  );
}

export function AuthorsList({
  authors,
  affiliations,
}: {
  authors: PageFrontmatter['authors'];
  affiliations: PageFrontmatter['affiliations'];
}) {
  if (!authors || authors.length === 0) return null;
  return (
    <div>
      {authors.map((a, i) => (
        <Author
          key={a.name}
          author={a}
          affiliations={affiliations}
          className={classNames('myst-fm-author-inline', {
            'myst-fm-author-comma': i < authors.length - 1,
          })}
        />
      ))}
    </div>
  );
}

export function AuthorAndAffiliations({
  authors,
  affiliations,
}: {
  authors: PageFrontmatter['authors'];
  affiliations: PageFrontmatter['affiliations'];
}) {
  if (!authors || authors.length === 0) return null;
  const hasAffliations = authors.reduce(
    (r, { affiliations: a }) => r || (!!a && a?.length > 0),
    false,
  );
  if (!hasAffliations) {
    return (
      <header className="myst-fm-authors-header">
        <AuthorsList authors={authors} affiliations={affiliations} />
      </header>
    );
  }
  return (
    <header className="myst-fm-authors-header">
      <div className="myst-fm-authors-grid">
        {authors.length > 1 && (
          <>
            <div className="myst-fm-authors-label">Authors</div>
            <div className="myst-fm-authors-label">Affiliations</div>
          </>
        )}
        {authors.map((author) => (
          <React.Fragment key={author.name}>
            <div>
              <Author author={author} affiliations={affiliations} />
            </div>
            <div className="myst-fm-affiliation-list">
              {author.affiliations?.map((affiliationId) => {
                return (
                  <div key={affiliationId}>
                    <Affiliation affiliations={affiliations} affiliationId={affiliationId} />
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </header>
  );
}
