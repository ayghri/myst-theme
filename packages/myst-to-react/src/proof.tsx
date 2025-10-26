import type { Admonition as AdmonitionSpec } from 'myst-spec';
import React from 'react';
import type { NodeRenderer } from '@myst-theme/providers';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import { HashLink } from './hashLink.js';
import type { GenericNode } from 'myst-common';
import { MyST } from './MyST.js';

export enum ProofKind {
  proof = 'proof',
  axiom = 'axiom',
  lemma = 'lemma',
  definition = 'definition',
  criterion = 'criterion',
  remark = 'remark',
  conjecture = 'conjecture',
  corollary = 'corollary',
  algorithm = 'algorithm',
  example = 'example',
  property = 'property',
  observation = 'observation',
  proposition = 'proposition',
  assumption = 'assumption',
  theorem = 'theorem',
}

type Color = 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'purple';

function getClasses(className?: string) {
  const classes =
    className
      ?.split(' ')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => !!s) ?? [];
  return [...new Set(classes)];
}

function capitalize(kind?: string) {
  if (!kind) return '';
  return kind.slice(0, 1).toUpperCase() + kind.slice(1);
}

function getColor({ kind }: { kind?: ProofKind | string; classes?: string[] }): {
  color: Color;
} {
  switch (kind) {
    case ProofKind.proof:
    case ProofKind.algorithm:
      return { color: 'gray' };
    case ProofKind.lemma:
    case ProofKind.conjecture:
    case ProofKind.theorem:
      return { color: 'purple' };
    case ProofKind.observation:
    case ProofKind.assumption:
    case ProofKind.axiom:
      return { color: 'yellow' };
    case ProofKind.criterion:
    case ProofKind.corollary:
    case ProofKind.property:
      return { color: 'orange' };
    case ProofKind.example:
      return { color: 'green' };
    case ProofKind.remark:
      return { color: 'red' };
    case ProofKind.definition:
    case ProofKind.proposition:
    default:
      return { color: 'blue' };
  }
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

const iconClass = 'myst-proof-chevron';

export function Proof({
  title,
  kind,
  color,
  dropdown,
  children,
  identifier,
  enumerator,
  className,
}: {
  title?: React.ReactNode;
  color?: Color;
  kind?: ProofKind;
  children: React.ReactNode;
  dropdown?: boolean;
  identifier?: string;
  enumerator?: string;
  className?: string;
}) {
  return (
    <WrapperElement
      id={identifier}
      dropdown={dropdown}
      className={classNames(
        'myst-proof',
        {
          'myst-proof-gray': !color || color === 'gray',
          'myst-proof-blue': color === 'blue',
          'myst-proof-green': color === 'green',
          'myst-proof-yellow': color === 'yellow',
          'myst-proof-orange': color === 'orange',
          'myst-proof-red': color === 'red',
          'myst-proof-purple': color === 'purple',
        },
        className,
      )}
    >
      <HeaderElement
        dropdown={dropdown}
        className={classNames('myst-proof-header', {
          'myst-proof-header-gray': !color || color === 'gray',
          'myst-proof-header-blue': color === 'blue',
          'myst-proof-header-green': color === 'green',
          'myst-proof-header-yellow': color === 'yellow',
          'myst-proof-header-orange': color === 'orange',
          'myst-proof-header-red': color === 'red',
          'myst-proof-header-purple': color === 'purple',
          'myst-proof-header-dropdown': dropdown,
        })}
      >
        <div className="myst-proof-title">
          <HashLink id={identifier} kind={capitalize(kind)}>
            {capitalize(kind)} {enumerator}
          </HashLink>{' '}
          {title && <>({title})</>}
        </div>
        {dropdown && (
          <div className="myst-proof-chevron-container">
            <ChevronRightIcon
              width="1.5rem"
              height="1.5rem"
              className={classNames(iconClass, 'transition-transform details-toggle')}
            />
          </div>
        )}
      </HeaderElement>
      <div className={classNames('myst-proof-body', { 'details-body': dropdown })}>
        {children}
      </div>
    </WrapperElement>
  );
}

export const ProofRenderer: NodeRenderer<AdmonitionSpec> = ({ node, className }) => {
  const [title, ...rest] = node.children as GenericNode[];
  const classes = getClasses(node.class);
  const { color } = getColor({ kind: node.kind, classes });
  const isDropdown = classes.includes('dropdown');

  const useTitle = title?.type === 'admonitionTitle';

  return (
    <Proof
      identifier={node.html_id}
      title={useTitle ? <MyST ast={[title]} /> : undefined}
      kind={node.kind as ProofKind}
      enumerator={(node as any).enumerator}
      color={color}
      dropdown={isDropdown}
      className={className}
    >
      {useTitle ? <MyST ast={rest} /> : <MyST ast={node.children} />}
    </Proof>
  );
};

const PROOF_RENDERERS = {
  proof: ProofRenderer,
};

export default PROOF_RENDERERS;
