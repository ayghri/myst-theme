import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import classNames from 'classnames';

export function CopyIcon({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const onClick = () => {
    if (copied) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };
  return (
    <button
      title={copied ? 'Copied!!' : 'Copy to Clipboard'}
      className={classNames(
        'myst-copy-button',
        {
          'myst-copy-button-default': !copied,
          'myst-copy-button-success': copied,
        },
        className,
      )}
      onClick={onClick}
      aria-pressed={copied ? 'true' : 'false'}
      aria-label="Copy code to clipboard"
    >
      {copied ? (
        <CheckIcon width={24} height={24} className="myst-copy-icon-success" />
      ) : (
        <DocumentDuplicateIcon width={24} height={24} />
      )}
    </button>
  );
}
