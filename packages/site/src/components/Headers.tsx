import {
  FrontmatterBlock,
  GitHubLink,
  Journal,
  LicenseBadges,
  OpenAccessBadge,
} from '@myst-theme/frontmatter';
import { useGridSystemProvider } from '@myst-theme/providers';
import classNames from 'classnames';
import type { PageFrontmatterWithDownloads } from '@myst-theme/common';
import { ThemeButton } from './Navigation/index.js';

export function ArticleHeader({
  frontmatter,
  children,
  toggleTheme,
  className,
}: {
  frontmatter: PageFrontmatterWithDownloads;
  children?: React.ReactNode;
  toggleTheme?: boolean;
  className?: string;
}) {
  const grid = useGridSystemProvider();
  const { subject, venue, volume, issue, ...rest } = frontmatter ?? {};
  const positionBackground = {
    'col-page-right': grid === 'article-left-grid',
    'col-page': grid === 'article-grid',
  };
  const positionFrontmatter = {
    'col-body': grid === 'article-left-grid',
    'col-page-left': grid === 'article-grid',
  };
  return (
    <header className="myst-article-header">
      {frontmatter?.banner && (
        // This is the banner contained in a full-bleed div
        <div
          className={classNames(
            'myst-article-header-banner',
            grid,
          )}
          style={{
            backgroundImage: `url(${frontmatter?.banner})`,
          }}
        />
      )}
      <div
        className={classNames(
          'myst-article-header-content article',
          grid,
          {
            'my-[2rem] pb-[1rem] md:my-[4rem]': frontmatter?.banner,
            'my-[2rem]': !frontmatter?.banner,
          },
          className,
        )}
      >
        <div
          className={classNames(positionBackground, {
            'shadow-2xl bg-white/80 dark:bg-black/80 backdrop-blur': frontmatter?.banner,
          })}
        >
          <div
            className={classNames('myst-article-header-topbar', {
              'px-4 w-full': frontmatter?.banner,
              'bg-white/80 dark:bg-black/80': frontmatter?.banner,
              ...positionBackground,
            })}
          >
            {subject && <div className="myst-article-header-subject">{subject}</div>}
            <Journal
              venue={venue}
              volume={volume}
              issue={issue}
              className="myst-article-header-journal"
            />
            <div className="myst-article-header-spacer"></div>
            <div className="myst-article-header-badges">
              <LicenseBadges license={frontmatter?.license} />
              <OpenAccessBadge open_access={frontmatter?.open_access} />
              <GitHubLink github={frontmatter?.github} />
            </div>
            {toggleTheme && <ThemeButton className="inline-block w-5 h-5 mt-0.5 ml-1" />}
          </div>
          <div className="myst-article-header-bottom">
            <FrontmatterBlock
              frontmatter={rest}
              authorStyle="list"
              className={classNames('flex-grow', {
                'pt-6 px-6': frontmatter?.banner,
                ...positionFrontmatter,
              })}
              hideBadges
              hideExports
            />
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}
