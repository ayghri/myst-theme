import type { Admonition as AdmonitionSpec } from 'myst-spec';
import React from 'react';
import type { NodeRenderer } from '@myst-theme/providers';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import { HashLink } from './hashLink.js';
import type { GenericNode } from 'myst-common';
import { MyST } from './MyST.js';

type Color = 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'purple';

function getClasses(className?: string) {
  const classes =
    className
      ?.split(' ')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => !!s) ?? [];
  return [...new Set(classes)];
}

function getColor(
  { classes = [] }: { classes?: string[] },
  defaultColor: Color = 'blue',
): {
  color: Color;
} {
  if (classes.includes('gray')) return { color: 'gray' };
  if (classes.includes('purple')) return { color: 'purple' };
  if (classes.includes('yellow')) return { color: 'yellow' };
  if (classes.includes('orange')) return { color: 'orange' };
  if (classes.includes('green')) return { color: 'green' };
  if (classes.includes('red')) return { color: 'red' };
  if (classes.includes('blue')) return { color: 'blue' };
  return { color: defaultColor };
}

const WrapperElement = ({
  id,
  dropdown,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  dropdown?: boolean;
}) => {
  if (dropdown)
    return (
      <details id={id} className={className}>
        {children}
      </details>
    );
  return (
    <aside id={id} className={className}>
      {children}
    </aside>
  );
};

const HeaderElement = ({
  dropdown,
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
  dropdown?: boolean;
}) => {
  if (dropdown) return <summary className={className}>{children}</summary>;
  return <div className={className}>{children}</div>;
};

const iconClass = 'myst-exercise-icon';

export function Callout({
  title,
  color,
  dropdown,
  children,
  identifier,
  className,
  Icon,
}: {
  title?: React.ReactNode;
  color?: Color;
  children: React.ReactNode;
  dropdown?: boolean;
  identifier?: string;
  className?: string;
  Icon?: (props: { width?: string; height?: string; className?: string }) => JSX.Element;
}) {
  return (
    <WrapperElement
      id={identifier}
      dropdown={dropdown}
      className={classNames(
        'myst-exercise',
        {
          'myst-exercise-gray': !color || color === 'gray',
          'myst-exercise-blue': color === 'blue',
          'myst-exercise-green': color === 'green',
          'myst-exercise-yellow': color === 'yellow',
          'myst-exercise-orange': color === 'orange',
          'myst-exercise-red': color === 'red',
          'myst-exercise-purple': color === 'purple',
        },
        className,
      )}
    >
      <HeaderElement
        dropdown={dropdown}
        className={classNames(
          'myst-exercise-header',
          {
            'myst-exercise-header-gray': !color || color === 'gray',
            'myst-exercise-header-blue': color === 'blue',
            'myst-exercise-header-green': color === 'green',
            'myst-exercise-header-yellow': color === 'yellow',
            'myst-exercise-header-orange': color === 'orange',
            'myst-exercise-header-red': color === 'red',
            'myst-exercise-header-purple': color === 'purple',
            'myst-exercise-header-dropdown': dropdown,
          },
        )}
      >
        {Icon && (
          <Icon
            width="2rem"
            height="2rem"
            className={classNames(
              iconClass,
              {
                'myst-exercise-icon-gray': !color || color === 'gray',
                'myst-exercise-icon-blue': color === 'blue',
                'myst-exercise-icon-green': color === 'green',
                'myst-exercise-icon-yellow': color === 'yellow',
                'myst-exercise-icon-orange': color === 'orange',
                'myst-exercise-icon-red': color === 'red',
                'myst-exercise-icon-purple': color === 'purple',
              },
            )}
          />
        )}
        <div
          className={classNames(
            'myst-exercise-title',
            { 'myst-exercise-title-no-icon': !Icon },
            'group',
          )}
        >
          {title}
        </div>
        {dropdown && (
          <div className="myst-exercise-chevron-container">
            <ChevronRightIcon
              width="1.5rem"
              height="1.5rem"
              className="myst-exercise-chevron"
            />
          </div>
        )}
      </HeaderElement>
      <div className={classNames('myst-exercise-body', { 'details-body': dropdown })}>
        {children}
      </div>
    </WrapperElement>
  );
}

export const ExerciseRenderer: NodeRenderer<AdmonitionSpec> = ({ node, className }) => {
  if ((node as any).hidden) return null;
  const [title, ...rest] = (node.children as GenericNode[]) ?? [];
  const classes = getClasses(node.class);
  const { color } = getColor({ classes });
  const isDropdown = classes.includes('dropdown');

  const useTitle = node.children?.[0]?.type === 'admonitionTitle';

  const identifier = node.html_id;
  const enumerator = (node as any).enumerator;

  const titleNode = (
    <>
      <HashLink id={identifier} kind="Exercise">
        {(node as any).gate === 'start' && 'Start of '}
        {(node as any).gate === 'end' && 'End of '}
        Exercise{enumerator != null && <> {enumerator}</>}
      </HashLink>
      {useTitle && (
        <>
          {' '}
          (<MyST ast={[title]} />)
        </>
      )}
    </>
  );

  return (
    <Callout
      identifier={identifier}
      title={titleNode}
      color={color}
      dropdown={isDropdown}
      className={className}
    >
      {useTitle ? <MyST ast={rest} /> : <MyST ast={node.children} />}
    </Callout>
  );
};

export const SolutionRenderer: NodeRenderer<AdmonitionSpec> = ({ node, className }) => {
  if ((node as any).hidden) return null;
  const [title, ...rest] = (node.children as GenericNode[]) ?? [];
  const classes = getClasses(node.class);
  const { color } = getColor({ classes }, 'gray');
  const isDropdown = classes.includes('dropdown');

  const useTitle = node.children?.[0]?.type === 'admonitionTitle';

  const identifier = node.html_id;

  const titleNode = (
    <>
      {(node as any).gate === 'start' && 'Start of '}
      {(node as any).gate === 'end' && 'End of '}
      <MyST ast={[title]} />
      <HashLink id={identifier} kind="Solution" hover hideInPopup>
        {' #'}
      </HashLink>
    </>
  );

  return (
    <Callout
      identifier={identifier}
      title={useTitle ? titleNode : undefined}
      color={color}
      dropdown={isDropdown}
      className={className}
    >
      {useTitle ? <MyST ast={rest} /> : <MyST ast={node.children} />}
    </Callout>
  );
};

const EXERCISE_RENDERERS = {
  exercise: ExerciseRenderer,
  solution: SolutionRenderer,
};

export default EXERCISE_RENDERERS;
