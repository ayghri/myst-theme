import type {
  Admonition as AdmonitionSpec,
  AdmonitionTitle as AdmonitionTitleSpec,
} from 'myst-spec';
import React from 'react';
import type { NodeRenderer } from '@myst-theme/providers';
import {
  InformationCircleIcon,
  ExclamationCircleIcon as OExclamationIcon,
  MegaphoneIcon,
  PencilSquareIcon,
  ArrowRightCircleIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import {
  ExclamationTriangleIcon as SExclamationIcon,
  ExclamationCircleIcon as SExclamationCircleIcon,
  XCircleIcon,
  BoltIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';
import classNames from 'classnames';
import { MyST } from './MyST.js';
import type { GenericNode } from 'myst-common';
// import { AdmonitionKind } from 'myst-common';

// TODO: get this from myst-spec?
export enum AdmonitionKind {
  admonition = 'admonition',
  attention = 'attention',
  caution = 'caution',
  danger = 'danger',
  error = 'error',
  important = 'important',
  hint = 'hint',
  note = 'note',
  seealso = 'seealso',
  tip = 'tip',
  warning = 'warning',
}

type Color = 'blue' | 'green' | 'yellow' | 'red';
type ColorAndKind = {
  kind: AdmonitionKind;
  color: Color;
};

function getClasses(className?: string) {
  const classes =
    className
      ?.split(' ')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => !!s) ?? [];
  return [...new Set(classes)];
}

function getFirstKind({
  kind,
  classes = [],
}: {
  kind?: AdmonitionKind | string;
  classes?: string[];
}): ColorAndKind {
  if (kind === AdmonitionKind.note || classes.includes('note')) {
    return { kind: AdmonitionKind.note, color: 'blue' };
  }
  if (kind === AdmonitionKind.important || classes.includes('important')) {
    return { kind: AdmonitionKind.important, color: 'blue' };
  }
  if (kind === AdmonitionKind.hint || classes.includes('hint')) {
    return { kind: AdmonitionKind.hint, color: 'green' };
  }
  if (kind === AdmonitionKind.seealso || classes.includes('seealso')) {
    return { kind: AdmonitionKind.seealso, color: 'green' };
  }
  if (kind === AdmonitionKind.tip || classes.includes('tip')) {
    return { kind: AdmonitionKind.tip, color: 'green' };
  }
  if (kind === AdmonitionKind.attention || classes.includes('attention')) {
    return { kind: AdmonitionKind.attention, color: 'yellow' };
  }
  if (kind === AdmonitionKind.warning || classes.includes('warning')) {
    return { kind: AdmonitionKind.warning, color: 'yellow' };
  }
  if (kind === AdmonitionKind.caution || classes.includes('caution')) {
    return { kind: AdmonitionKind.caution, color: 'yellow' };
  }
  if (kind === AdmonitionKind.danger || classes.includes('danger')) {
    return { kind: AdmonitionKind.danger, color: 'red' };
  }
  if (kind === AdmonitionKind.error || classes.includes('error')) {
    return { kind: AdmonitionKind.error, color: 'red' };
  }
  return { kind: AdmonitionKind.note, color: 'blue' };
}

const iconClass = 'myst-admonition-icon';

function AdmonitionIcon({ kind, className }: { kind: AdmonitionKind; className?: string }) {
  const cn = classNames(iconClass, className);
  const opts = { width: '2rem', height: '2rem', className: cn };
  if (kind === AdmonitionKind.note) return <InformationCircleIcon {...opts} />;
  if (kind === AdmonitionKind.caution) return <OExclamationIcon {...opts} />;
  if (kind === AdmonitionKind.warning) return <SExclamationIcon {...opts} />;
  if (kind === AdmonitionKind.danger) return <SExclamationCircleIcon {...opts} />;
  if (kind === AdmonitionKind.error) return <XCircleIcon {...opts} />;
  if (kind === AdmonitionKind.attention) return <MegaphoneIcon {...opts} />;
  if (kind === AdmonitionKind.tip) return <PencilSquareIcon {...opts} />;
  if (kind === AdmonitionKind.hint) return <LightBulbIcon {...opts} />;
  if (kind === AdmonitionKind.important) return <BoltIcon {...opts} />;
  if (kind === AdmonitionKind.seealso) return <ArrowRightCircleIcon {...opts} />;
  return <InformationCircleIcon {...opts} />;
}

export const AdmonitionTitle: NodeRenderer<AdmonitionTitleSpec> = ({ node, className }) => {
  return <MyST ast={node.children} className={className} />;
};

const WrapperElement = ({
  dropdown,
  className,
  children,
  open,
}: {
  className?: string;
  children: React.ReactNode;
  dropdown?: boolean;
  open?: boolean;
}) => {
  if (dropdown)
    return (
      <details className={className} open={open}>
        {children}
      </details>
    );
  return <aside className={className}>{children}</aside>;
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

export function Admonition({
  title,
  kind,
  color,
  simple,
  dropdown,
  children,
  hideIcon,
  className,
  open,
}: {
  title?: React.ReactNode;
  color?: Color;
  kind?: AdmonitionKind;
  children: React.ReactNode;
  simple?: boolean;
  dropdown?: boolean;
  hideIcon?: boolean;
  className?: string;
  open?: boolean;
}) {
  return (
    <WrapperElement
      dropdown={dropdown}
      open={open}
      className={classNames(
        'myst-admonition',
        `myst-admonition-${kind}`,
        {
          'myst-admonition-default': !simple,
          'myst-admonition-simple': simple,
          'myst-admonition-blue': !color || color === 'blue',
          'myst-admonition-green': color === 'green',
          'myst-admonition-yellow': color === 'yellow',
          'myst-admonition-red': color === 'red',
        },
        className,
      )}
    >
      {title && (
        <HeaderElement
          dropdown={dropdown}
          className={classNames('myst-admonition-header', {
            'myst-admonition-header-default': !simple,
            'myst-admonition-header-simple': simple,
            'myst-admonition-header-blue': !simple && (!color || color === 'blue'),
            'myst-admonition-header-green': !simple && color === 'green',
            'myst-admonition-header-yellow': !simple && color === 'yellow',
            'myst-admonition-header-red': !simple && color === 'red',
            'myst-admonition-header-dropdown': dropdown,
          })}
        >
          {!hideIcon && (
            <AdmonitionIcon
              kind={kind ?? AdmonitionKind.note}
              className={classNames({
                'myst-admonition-icon-blue': !color || color === 'blue',
                'myst-admonition-icon-green': color === 'green',
                'myst-admonition-icon-yellow': color === 'yellow',
                'myst-admonition-icon-red': color === 'red',
              })}
            />
          )}
          <div
            className={classNames(
              'myst-admonition-header-text',
              { 'myst-admonition-header-text-no-icon': hideIcon },
            )}
          >
            {title}
          </div>
          {dropdown && (
            <div className="myst-admonition-chevron-container">
              <ChevronRightIcon
                width="2rem"
                height="2rem"
                className="myst-admonition-chevron"
              />
            </div>
          )}
        </HeaderElement>
      )}
      <div
        className={classNames('myst-admonition-body', {
          'myst-admonition-body-default': !simple,
          'details-body': dropdown,
        })}
      >
        {children}
      </div>
    </WrapperElement>
  );
}

export const AdmonitionRenderer: NodeRenderer<AdmonitionSpec> = ({ node, className }) => {
  const [title, ...rest] = node.children as GenericNode[];
  const classes = getClasses(node.class);
  const { kind, color } = getFirstKind({ kind: node.kind, classes });
  const isDropdown = classes.includes('dropdown');
  const isSimple = classes.includes('simple');
  const hideIcon = node.icon === false;
  const isOpen = node.open === true;

  const useTitle = title?.type === 'admonitionTitle';

  return (
    <Admonition
      title={useTitle ? <MyST ast={[title]} /> : undefined}
      kind={kind}
      color={color}
      dropdown={isDropdown}
      open={isOpen}
      simple={isSimple}
      hideIcon={hideIcon}
      className={classNames(classes, className)}
    >
      {useTitle ? <MyST ast={rest} /> : <MyST ast={node.children} />}
    </Admonition>
  );
};

const ADMONITION_RENDERERS = {
  admonition: AdmonitionRenderer,
  admonitionTitle: AdmonitionTitle,
};

export default ADMONITION_RENDERERS;
