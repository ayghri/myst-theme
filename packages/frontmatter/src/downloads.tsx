import { Menu } from '@headlessui/react';
import {
  DocumentIcon,
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import type { SiteAction, SiteExport } from 'myst-config';
import { useCallback } from 'react';

type HasExports = {
  exports?: SiteExport[] | SiteAction[];
};

/**
 * triggerDirectDownload - aims to trigger a direct download for the
 *
 * @param url - url or resource to download
 * @param filename - default filename and extension for dialog / system
 * @returns - true or throws
 */
export async function triggerDirectDownload(url: string, filename: string) {
  const resp = await fetch(url);
  const blob = await resp.blob();

  return triggerBlobDownload(blob, filename);
}

/**
 * triggerBlobDownload - aims to trigger a direct download for the
 *
 * @param blob - blob to download
 * @param filename - default filename and extension for dialog / system
 * @returns - true or throws
 */
export async function triggerBlobDownload(blob: Blob, filename: string) {
  if (window.navigator && (window.navigator as any).msSaveOrOpenBlob)
    return (window.navigator as any).msSaveOrOpenBlob(blob);

  const objectUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  a.style.display = 'none';

  a.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    URL.revokeObjectURL(objectUrl);
    a.remove();
  }, 100);

  return true;
}

const ICON_CLASS = 'myst-fm-download-icon';

export function Download({
  url,
  filename,
  format,
  className,
  title,
  internal,
}: {
  url: string;
  filename?: string;
  format?: string;
  className?: string;
  title?: string;
  internal?: boolean;
}) {
  if (!filename) {
    const icon = internal ? (
      <DocumentIcon width="1.25rem" height="1.25rem" className={ICON_CLASS} aria-hidden="true" />
    ) : (
      <ArrowTopRightOnSquareIcon
        width="1.25rem"
        height="1.25rem"
        className={ICON_CLASS}
        aria-hidden="true"
      />
    );
    return (
      <a
        className={classNames(className, 'myst-fm-download-link')}
        href={url}
        target={!internal ? '_blank' : undefined}
        rel={!internal ? 'noreferrer noopener' : undefined}
      >
        <span className="sr-only">Visit URL {title ?? ''}</span>
        {icon}
        <span className="myst-fm-download-text">{title ?? url}</span>
      </a>
    );
  }
  const clickDownload = useCallback(
    (e: any) => {
      e.preventDefault();
      triggerDirectDownload(url, filename);
    },
    [url, filename],
  );
  return (
    <a className={classNames(className, 'myst-fm-download-link')} href={url} onClick={clickDownload}>
      <span className="sr-only">
        Download{format ? ` as ${format}` : ''} {title ?? ''}
      </span>
      <DocumentArrowDownIcon
        width="1.25rem"
        height="1.25rem"
        className={ICON_CLASS}
        aria-hidden="true"
      />
      <span className="myst-fm-download-text">{title ?? filename}</span>
    </a>
  );
}

export function DownloadsDropdown({ exports }: HasExports) {
  if (!exports || exports.length === 0) return null;
  return (
    <Menu as="div" className="myst-fm-downloads-menu">
      <Menu.Button className="myst-fm-downloads-button">
        <span className="sr-only">Downloads</span>
        <ArrowDownTrayIcon width="1.25rem" height="1.25rem" aria-hidden="true" title="Download" />
      </Menu.Button>
      <Menu.Items className="myst-fm-downloads-panel">
        {exports.map((exp, index) => (
          <Menu.Item key={index}>
            <Download
              className="myst-fm-downloads-item"
              url={exp.url}
              filename={exp.filename}
              format={exp.format}
              title={(exp as any).title}
              internal={(exp as any).internal}
            />
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
