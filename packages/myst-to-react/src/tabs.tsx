import classNames from 'classnames';
import type { GenericNode } from 'myst-common';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { selectAll } from 'unist-util-select';
import { useTabSet, type NodeRenderer } from '@myst-theme/providers';
import { MyST } from './MyST.js';

interface TabItem extends GenericNode {
  key: string;
  title: string;
  sync?: string;
  selected?: boolean;
}

const TabSetContext = createContext<string | undefined>(undefined);

// Create a provider for components to consume and subscribe to changes
function TabSetStateProvider({ active, children }: { active: string; children: React.ReactNode }) {
  return <TabSetContext.Provider value={active}>{children}</TabSetContext.Provider>;
}

type Tab = { title: string | React.ReactNode; id: string; sync?: string; selected?: boolean };

export function TabSet({
  tabs,
  children,
  className,
}: {
  tabs: Tab[];
  children: React.ReactNode;
  className?: string;
}) {
  const [lastClickedTab, onClickSyncedTab] = useTabSet() ?? [];
  const [active, setActive] = useState<string>(tabs.find((t) => t.selected)?.id ?? tabs?.[0]?.id);
  const onClick = (tab: Tab) => {
    setActive(tab.id);
    if (tab.sync) {
      if (!onClickSyncedTab) {
        console.error('TabStateProvider is not defined, synced tabs will not work.');
      }
      onClickSyncedTab?.(tab.sync);
    }
  };

  useEffect(() => {
    if (!lastClickedTab) return;
    const tab = tabs.find((item) => item.sync === lastClickedTab);
    if (!tab) return;
    setActive(tab?.id);
  }, [tabs, lastClickedTab, setActive]);

  return (
    <TabSetStateProvider active={active}>
      <div className={classNames('myst-tab-set', className)}>
        <div className="myst-tab-set-row">
          {tabs.map((tab) => {
            return (
              <div
                key={tab.id}
                className={classNames('myst-tab-item-header', {
                  'myst-tab-item-header-active': active === tab.id,
                  'myst-tab-item-header-inactive': active !== tab.id,
                })}
                onClick={() => onClick(tab)}
              >
                {tab.title}
              </div>
            );
          })}
        </div>
        <div className="myst-tab-item-body">
          <div className="myst-tab-item-text">{children}</div>
        </div>
      </div>
    </TabSetStateProvider>
  );
}

export function TabItem({
  id,
  children,
  className,
}: Omit<Tab, 'title' | 'sync'> & { children: React.ReactNode; className?: string }) {
  const active = useContext(TabSetContext);
  const open = active === id;
  return <div className={classNames({ hidden: !open }, className)}>{children}</div>;
}

export const TabSetRenderer: NodeRenderer = ({ node, className }) => {
  // Add the key as the ID (key is special in react)
  const tabs = (selectAll('tabItem', node) as TabItem[]).map((tab) => ({
    title: tab.title,
    id: tab.key,
    sync: tab.sync,
  }));
  return (
    <TabSet tabs={tabs} className={className}>
      <MyST ast={node.children} />
    </TabSet>
  );
};

export const TabItemRenderer: NodeRenderer<TabItem> = ({ node, className }) => {
  return (
    <TabItem id={node.key} className={className}>
      <MyST ast={node.children} />
    </TabItem>
  );
};

const TAB_RENDERERS: Record<string, NodeRenderer> = {
  tabSet: TabSetRenderer,
  tabItem: TabItemRenderer,
};

export default TAB_RENDERERS;
