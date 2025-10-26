import React, { useState } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import classNames from 'classnames';

export function HoverPopover({
  children,
  openDelay = 400,
  card,
  side,
  arrowClass = 'fill-white',
}: {
  children: React.ReactNode;
  openDelay?: number;
  arrowClass?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  card: React.ReactNode | ((args: { load: boolean }) => React.ReactNode);
}) {
  const [load, setLoad] = useState(false);
  return (
    <HoverCard.Root openDelay={openDelay}>
      <HoverCard.Trigger asChild onMouseEnter={() => setLoad(true)}>
        {children}
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="myst-hover-card"
          sideOffset={5}
          side={side}
        >
          {typeof card === 'function' ? load && card({ load }) : card}
          <HoverCard.Arrow className={arrowClass} />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

export function Tooltip({
  title,
  children,
  className,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <HoverPopover
      side="top"
      card={
        <div
          className={classNames(
            'myst-tooltip',
            className,
          )}
        >
          {title}
        </div>
      }
      arrowClass="myst-tooltip-arrow"
    >
      {children}
    </HoverPopover>
  );
}
