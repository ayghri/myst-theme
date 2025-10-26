import { useLinkProvider, useBaseurl, withBaseurl } from '@myst-theme/providers';
import { ArrowTopRightOnSquareIcon as ExternalLinkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

export function LinkCard({
  url,
  title,
  internal = false,
  loading = false,
  description,
  thumbnail,
  className = 'w-[300px] sm:max-w-[500px] bg-white rounded shadow-md',
}: {
  url: string;
  internal?: boolean;
  loading?: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  thumbnail?: string | null;
  className?: string;
}) {
  const Link = useLinkProvider();
  const baseurl = useBaseurl();
  const to = withBaseurl(url, baseurl);
  return (
    <div
      className={classNames('myst-link-card', className, {
        'myst-link-card-loading': loading,
      })}
    >
      {!loading && thumbnail && (
        <img src={thumbnail} className="myst-link-card-image" />
      )}
      {loading && <div className="myst-link-card-placeholder" />}
      {internal && (
        <Link
          to={to}
          className="myst-link-card-link"
          prefetch="intent"
        >
          {title}
        </Link>
      )}
      {!internal && (
        <a
          href={to}
          className="myst-link-card-link"
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLinkIcon width="1rem" height="1rem" className="myst-link-card-icon" />
          {title}
        </a>
      )}
      {!loading && description && (
        <div className="myst-link-card-description">{description}</div>
      )}
    </div>
  );
}
