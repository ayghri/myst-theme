import classNames from 'classnames';
import { useBaseurl, useLinkProvider, withBaseurl } from '@myst-theme/providers';

export function HomeLink({
  logo,
  logoDark,
  logoText,
  name,
  url,
}: {
  logo?: string;
  logoDark?: string;
  logoText?: string;
  name?: string;
  url?: string;
}) {
  const Link = useLinkProvider();
  const baseurl = useBaseurl();
  const nothingSet = !logo && !logoText;
  return (
    <Link
      className="myst-homelink"
      to={url ? url : withBaseurl('/', baseurl)}
      prefetch="intent"
    >
      {logo && (
        <div
          className={classNames('myst-homelink-logo', {
            'dark:bg-white dark:rounded': !logoDark,
          })}
        >
          <img
            src={logo}
            className={classNames('h-9', { 'dark:hidden': !!logoDark })}
            alt={logoText || name}
            height="2.25rem"
          ></img>
          {logoDark && (
            <img
              src={logoDark}
              className="myst-homelink-logo-dark"
              alt={logoText || name}
              height="2.25rem"
            ></img>
          )}
        </div>
      )}
      <span
        className={classNames('myst-homelink-title', {
          'sr-only': !(logoText || nothingSet),
        })}
      >
        {logoText || 'Made with MyST'}
      </span>
    </Link>
  );
}
