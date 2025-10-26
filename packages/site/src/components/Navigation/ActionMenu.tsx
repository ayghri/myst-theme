import { Fragment } from 'react';
import classNames from 'classnames';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import type { SiteManifest } from 'myst-config';

export function ActionMenu({ actions }: { actions?: SiteManifest['actions'] }) {
  if (!actions || actions.length === 0) return null;
  return (
        <Menu as="div" className="myst-action-menu">
      <div>
                <Menu.Button className="myst-action-menu-button">
          <span className="sr-only">Open Menu</span>
                    <div className="myst-action-menu-content">
            <EllipsisVerticalIcon width="2rem" height="2rem" className="p-1" />
          </div>
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
                <Menu.Items className="myst-action-menu-items">
          {actions?.map((action) => (
            <Menu.Item key={action.url}>
              {({ active }) => (
                <a
                  href={action.url}
                  className={classNames(
                                        active ? 'myst-action-menu-item-active' : 'myst-action-menu-item-inactive'
                  )}
                >
                  {action.title}
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
