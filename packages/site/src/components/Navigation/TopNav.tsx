import { Fragment } from 'react';
import classNames from 'classnames';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, Bars3Icon as MenuIcon } from '@heroicons/react/24/solid';
import type { SiteManifest, SiteNavItem } from 'myst-config';
import { ThemeButton } from './ThemeButton.js';
import { Search } from './Search.js';
import {
  useBaseurl,
  useNavLinkProvider,
  useNavOpen,
  useSiteManifest,
  withBaseurl,
} from '@myst-theme/providers';
import { LoadingBar } from './Loading.js';
import { HomeLink } from './HomeLink.js';
import { ActionMenu } from './ActionMenu.js';
import { ExternalOrInternalLink } from './Link.js';

export const DEFAULT_NAV_HEIGHT = 60;

export function NavItem({ item }: { item: SiteNavItem }) {
  const NavLink = useNavLinkProvider();
  const baseurl = useBaseurl();
  if (!('children' in item)) {
    return (
      <div className="myst-topnav-item">
        <ExternalOrInternalLink
          nav
          to={withBaseurl(item.url, baseurl) ?? ''}
          className={({ isActive }) =>
            classNames(
              'inline-flex items-center justify-center w-full mx-2 py-1 text-md font-medium dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
              {
                'border-b border-stone-200': isActive,
              },
            )
          }
        >
          {item.title}
        </ExternalOrInternalLink>
      </div>
    );
  }
  return (
    <Menu as="div" className="myst-topnav-item">
      <div className="inline-block">
        <Menu.Button className="myst-topnav-menu-button">
          <span>{item.title}</span>
          <ChevronDownIcon width="1.25rem" height="1.25rem" className="myst-topnav-chevron" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="myst-topnav-menu-items">
          {item.children?.map((action) => (
            <Menu.Item key={action.url}>
              {/* This is really ugly, BUT, the action needs to be defined HERE or the click away doesn't work for some reason */}
              {action.url?.startsWith('http') ? (
                <a
                  href={action.url || ''}
                  className="myst-topnav-menu-item"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {action.title}
                </a>
              ) : (
                <NavLink
                  to={action.url || ''}
                  className={({ isActive }) =>
                isActive ? 'myst-topnav-menu-item-active' : 'myst-topnav-menu-item'
                  }
                >
                  {action.title}
                </NavLink>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export function NavItems({ nav }: { nav?: SiteManifest['nav'] }) {
  if (!nav) return null;
  return (
    <div className="myst-topnav-container">
      {nav.map((item) => {
        return <NavItem key={'url' in item ? item.url : item.title} item={item} />;
      })}
    </div>
  );
}

export function TopNav({ hideToc, hideSearch }: { hideToc?: boolean; hideSearch?: boolean }) {
  const [open, setOpen] = useNavOpen();
  const config = useSiteManifest();
  const { title, nav, actions } = config ?? {};
  const { logo, logo_dark, logo_text, logo_url } = config?.options ?? {};
  return (
    <div className="myst-topnav-bar">
      <nav className="myst-topnav-inner">
        <div className="myst-topnav-logo-container">
          {
            <div
              className={classNames('myst-topnav-mobile-menu', {
                'lg:hidden': nav && hideToc,
                'xl:hidden': !(nav && hideToc),
              })}
            >
              <button
                className="myst-topnav-mobile-menu-button"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <MenuIcon width="2rem" height="2rem" className="m-1" />
                <span className="sr-only">Open Menu</span>
              </button>
            </div>
          }
          <HomeLink
            name={title}
            logo={logo}
            logoDark={logo_dark}
            logoText={logo_text}
            url={logo_url}
          />
        </div>
        <div className="myst-topnav-right">
          <NavItems nav={nav} />
          <div className="flex-grow block"></div>
          {!hideSearch && <Search />}
          <ThemeButton />
          <div className="block sm:hidden">
            <ActionMenu actions={actions} />
          </div>
          <div className="hidden sm:block">
            {actions?.map((action, index) => (
              <ExternalOrInternalLink
                key={action.url || index}
                className="myst-topnav-action"
                to={action.url}
              >
                {action.title}
              </ExternalOrInternalLink>
            ))}
          </div>
        </div>
      </nav>
      <LoadingBar />
    </div>
  );
}
