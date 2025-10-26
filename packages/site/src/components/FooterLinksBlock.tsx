import classNames from 'classnames';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import type { FooterLinks, NavigationLink } from '@myst-theme/common';
import { useLinkProvider, useBaseurl, withBaseurl } from '@myst-theme/providers';

export const FooterLink = ({
  title,
  short_title,
  url,
  group,
  right,
}: NavigationLink & { right?: boolean }) => {
  const baseurl = useBaseurl();
  const Link = useLinkProvider();
  return (
    <Link
      prefetch="intent"
      className="myst-footer-link"
      to={withBaseurl(url, baseurl)}
    >
      <div className="myst-footer-link-content">
        {right && (
          <ArrowLeftIcon
            width="1.5rem"
            height="1.5rem"
            className="myst-footer-link-arrow-left"
          />
        )}
        <div className={classNames(right ? 'myst-footer-link-text-right' : 'myst-footer-link-text')}>
          <div className="myst-footer-link-group">{group || ' '}</div>
          {short_title || title}
        </div>
        {!right && (
          <ArrowRightIcon
            width="1.5rem"
            height="1.5rem"
            className="myst-footer-link-arrow-right"
          />
        )}
      </div>
    </Link>
  );
};

export function FooterLinksBlock({ links }: { links?: FooterLinks }) {
  if (!links || (!links.navigation?.prev && !links.navigation?.next)) return null;
  return (
    <div className="myst-footer-links">
      {links.navigation?.prev && <FooterLink {...links.navigation?.prev} right />}
      {links.navigation?.next && <FooterLink {...links.navigation?.next} />}
    </div>
  );
}
