import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import type { PageFrontmatter } from 'myst-frontmatter';
import { Affiliation } from './Affiliations.js';

type Author = Required<PageFrontmatter>['authors'][0];
type Affiliations = Required<PageFrontmatter>['affiliations'];

function Definition({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="myst-fm-popover-definition">
      <dt className="myst-fm-popover-term">{title}</dt>
      <dd className="myst-fm-popover-description">{children}</dd>
    </div>
  );
}

export const AuthorPopover = ({
  author,
  affiliations,
  children,
}: {
  author?: Author;
  affiliations?: Affiliations;
  children: React.ReactNode;
}) => {
  if (!author) return <>{children}</>;
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="myst-fm-popover-trigger"
          aria-label="Author Details"
        >
          {children}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="myst-fm-popover-content"
          sideOffset={5}
        >
          <div className="myst-fm-popover-container">
            <p className="myst-fm-popover-name">
              {author.name}
            </p>
            <p className="myst-fm-popover-affiliations">
              {author.affiliations?.map((affiliationId) => (
                <Affiliation
                  key={affiliationId}
                  affiliations={affiliations}
                  affiliationId={affiliationId}
                />
              ))}
            </p>
            <dl className="myst-fm-popover-list">
              {author.email && (
                <Definition title="Email">
                  <a
                    className="myst-fm-popover-link"
                    href={`mailto:${author.email}`}
                    title={`${author.name} <${author.email}>`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {author.email}
                  </a>
                </Definition>
              )}
              {author.orcid && (
                <Definition title="ORCID">
                  <a
                    className="myst-fm-popover-link"
                    href={`https://orcid.org/${author.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="ORCID (Open Researcher and Contributor ID)"
                  >
                    {author.orcid}
                  </a>
                </Definition>
              )}
              {author.github && (
                <Definition title="GitHub">
                  <a
                    className="myst-fm-popover-link"
                    href={`https://github.com/${author.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`GitHub: ${author.github}`}
                  >
                    @{author.github}
                  </a>
                </Definition>
              )}
              {author.twitter && (
                <Definition title="X Account">
                  <a
                    className="myst-fm-popover-link"
                    href={`https://x.com/${author.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`X Account: ${author.twitter}`}
                  >
                    @{author.twitter}
                  </a>
                </Definition>
              )}
              {author.url && (
                <Definition title="Website">
                  <a
                    className="myst-fm-popover-link"
                    href={author.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Author Website`}
                  >
                    {author.url}
                  </a>
                </Definition>
              )}
              {author.roles && <Definition title="Roles">{author.roles.join(', ')}</Definition>}
            </dl>
          </div>
          <Popover.Arrow className="myst-fm-popover-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
