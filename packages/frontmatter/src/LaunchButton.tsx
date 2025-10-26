import React, { useRef, useCallback, useState } from 'react';
import classNames from 'classnames';

import * as Popover from '@radix-ui/react-popover';
import {
  RocketIcon,
  Cross2Icon,
  ClipboardCopyIcon,
  ExternalLinkIcon,
  QuestionMarkCircledIcon,
  UpdateIcon,
  Link2Icon,
} from '@radix-ui/react-icons';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { BinderIcon, JupyterIcon } from '@scienceicons/react/24/solid';
import * as Form from '@radix-ui/react-form';
import type { ExpandedThebeFrontmatter, BinderHubOptions } from 'myst-frontmatter';

const GITHUB_USERNAME_REPO_REGEX =
  /^(?:https?:\/\/github.com\/)?([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)(?:.git)?\/?$/;
const GITLAB_USERNAME_REPO_REGEX =
  /^(?:https?:\/\/gitlab.com\/)?([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)(?:.git)?\/?$/;
const GIST_USERNAME_REPO_REGEX =
  /^(?:https?:\/\/gist.github.com\/)?([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)(?:.git)?\/?$/;

type CopyButtonProps = {
  defaultMessage: string;
  copiedMessage?: string;
  invalidLinkFallback?: string;
  copiedMessageDuration?: number;
  buildLink: () => string | undefined;
  className?: string;
};

/**
 * Component to add a copy-to-clipboard button
 */
function CopyButton(props: CopyButtonProps) {
  const {
    className,
    defaultMessage,
    copiedMessage,
    invalidLinkFallback,
    buildLink,
    copiedMessageDuration,
  } = props;
  const [message, setMessage] = useState(defaultMessage);

  const copyLink = useCallback(() => {
    // In secure links, we can copy it!
    if (window.isSecureContext) {
      // Build the link for the clipboard
      const link = props.buildLink();
      // Write to clipboard
      window.navigator.clipboard.writeText(link ?? invalidLinkFallback ?? '<invalid link>');
      // Update UI
      setMessage(copiedMessage ?? defaultMessage);

      // Set callback to restore message
      setTimeout(() => {
        setMessage(defaultMessage);
      }, copiedMessageDuration ?? 1000);
    }
  }, [
    defaultMessage,
    copiedMessage,
    buildLink,
    copiedMessageDuration,
    invalidLinkFallback,
    setMessage,
  ]);

  return (
    <button
      type="button"
      className={classNames(className, 'myst-fm-copy-button')}
      onClick={copyLink}
    >
      {message} <ClipboardCopyIcon className="myst-fm-copy-icon" />
    </button>
  );
}

export type LaunchProps = {
  thebe: ExpandedThebeFrontmatter;
  location: string;
};
type ModalLaunchProps = LaunchProps & {
  onLaunch?: () => void;
};

/**
 * Ensure URL of for http://foo.com/bar?baz
 * has the form      http://foo.com/bar/
 *
 * @param url - URL to parse
 */
function ensureBasename(url: string): string {
  // Parse input URL (or fallback)
  const parsedURL = new URL(url);
  // Drop any fragments
  let baseURL = `${parsedURL.origin}${parsedURL.pathname}`;
  // Ensure a trailing fragment
  if (!baseURL.endsWith('/')) {
    baseURL = `${baseURL}/`;
  }
  return baseURL;
}

/**
 * Equivalent to Python's `urllib.parse.urlencode` function
 *
 * @param params - mapping from parameter name to string value
 */
function encodeURLParams(params: Record<string, string | undefined>): string {
  return Object.entries(params)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
    .join('&');
}

/**
 * Make a binder url for supported providers
 *
 * - trim gitlab.com from repo
 * - trim trailing or leading '/' on repo
 * - convert to URL acceptable string. Required for gitlab
 * - trailing / on binderUrl
 *
 * Copied from thebe-core
 *
 * @param opts BinderOptions
 * @returns  a binder compatible url
 */
function makeBinderURL(
  options: BinderHubOptions,
  location: string,
  version: string = 'v2',
): string | undefined {
  let stub: string;

  if (!options.repo || !options.url) {
    return undefined;
  }

  switch (options.provider) {
    case 'git': {
      const encodedRepo = encodeURIComponent(options.repo);
      const encodedRef = encodeURIComponent(options.ref ?? 'HEAD');
      stub = `git/${encodedRepo}/${encodedRef}`;
      break;
    }
    case 'gitlab': {
      const [, org, repo] = options.repo.match(GITLAB_USERNAME_REPO_REGEX) ?? [];
      if (!org) {
        return undefined;
      }
      const encodedRef = encodeURIComponent(options.ref ?? 'HEAD');
      stub = `gl/${org}/${repo}/${encodedRef}`;
      break;
    }
    case 'github': {
      const [, org, repo] = options.repo.match(GITHUB_USERNAME_REPO_REGEX) ?? [];
      if (!org) {
        return undefined;
      }
      const encodedRef = encodeURIComponent(options.ref ?? 'HEAD');
      stub = `gh/${org}/${repo}/${encodedRef}`;
      break;
    }
    case 'gist': {
      const [, org, repo] = options.repo.match(GIST_USERNAME_REPO_REGEX) ?? [];
      if (!org) {
        return undefined;
      }
      const encodedRef = encodeURIComponent(options.ref ?? 'HEAD');
      stub = `gist/${org}/${repo}/${encodedRef}`;
      break;
    }
    default: {
      return undefined;
    }
  }
  // Build binder URL path
  const query = encodeURLParams({ urlpath: `/lab/tree/${location}` });

  const binderURL = ensureBasename(options.url);
  return `${binderURL}${version}/${stub}?${query}`;
}

function cloneNameFromRepo(repo: string) {
  const url = new URL(repo);
  const parts = url.pathname.slice(1).split('/');
  return parts[parts.length - 1] || url.hostname;
}

/**
 * Make an nbgitpuller url for supported providers
 *
 * - trim gitlab.com from repo
 * - trim trailing or leading '/' on repo
 * - convert to URL acceptable string. Required for gitlab
 * - trailing / on binderUrl
 *
 * Copied from thebe-core
 *
 * @param opts BinderOptions
 * @returns  a binder compatible url
 */
function makeNbgitpullerURL(options: BinderHubOptions, location: string): string | undefined {
  if (!options.repo || !options.url) {
    return undefined;
  }
  const { ref } = options;

  let repo: string;
  let cloneName: string;

  switch (options.provider) {
    case 'git': {
      repo = options.repo;
      cloneName = cloneNameFromRepo(repo);
      break;
    }
    case 'gitlab': {
      const [, org, name] = options.repo.match(GITLAB_USERNAME_REPO_REGEX) ?? [];
      repo = `https://gitlab.com/${org}/${name}`;
      cloneName = name;
      break;
    }
    case 'github': {
      const [, org, name] = options.repo.match(GITHUB_USERNAME_REPO_REGEX) ?? [];
      repo = `https://github.com/${org}/${name}`;
      cloneName = name;
      break;
    }
    case 'gist': {
      const [, , rev] = options.repo.match(GIST_USERNAME_REPO_REGEX) ?? [];
      repo = `https://gist.github.com/${rev}`;
      cloneName = rev;
      break;
    }
    default: {
      return undefined;
    }
  }

  // Build binder URL path
  const query = encodeURLParams({
    repo,
    // Need a valid branch name, not a rev
    // branch: ref,
    urlpath: `/lab/tree/${cloneName}${location}`,
  });

  return `git-pull?${query}`;
}

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  React.useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handle);
    };
  }, [value, delay]);
  return debouncedValue;
}

type ProviderType = 'binderhub' | 'jupyterhub';

/**
 * Interrogate a possible remote provider URL to
 * determine whether it is a BinderHub or JupyterHub
 *
 * @param baseUrl - URL to interrogate, ending with a slash
 */
async function interrogateProviderType(baseUrl: string): Promise<ProviderType | 'error'> {
  const binderURL = `${baseUrl}versions`;
  try {
    const response = await fetch(binderURL);
    const data = await response.json();
    if ('binderhub' in data) {
      return 'binderhub';
    }
  } catch (err) {
    console.debug(`Couldn't reach ${binderURL}`);
  }
  const hubURL = `${baseUrl}hub/api/`;
  try {
    const response = await fetch(hubURL);
    const data = await response.json();
    if ('version' in data) {
      return 'jupyterhub';
    }
  } catch (err) {
    console.debug(`Couldn't reach ${binderURL}`);
  }

  return 'error';
}

function DetectLaunchContent(props: ModalLaunchProps) {
  const { thebe, location, onLaunch } = props;
  const { binder } = thebe;
  const defaultBinderBaseURL = binder?.url ?? 'https://mybinder.org';

  // Detect the provider type
  const [detectedProviderType, setDetectedProviderType] = useState<
    ProviderType | 'error' | undefined
  >(undefined);

  // Handle URL entry that needs to be debounced
  const [url, setURL] = useState('');
  const onUrlChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // Reset the known state of the provider
      setDetectedProviderType(undefined);
      // Update the recorded state of the URL input
      setURL(event.target.value);
    },
    [setURL],
  );

  const formRef = useRef<HTMLFormElement>(null);

  const buildLink = useCallback(() => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    const data = Object.fromEntries(new FormData(form) as any);
    const rawBaseUrl = data.url;
    if (!rawBaseUrl) {
      return;
    }
    const baseUrl = ensureBasename(rawBaseUrl);

    const userProvider = data?.provider as ProviderType | undefined;
    const provider = userProvider ?? detectedProviderType;
    switch (provider) {
      case 'jupyterhub': {
        const gitPullURL = makeNbgitpullerURL(binder ?? {}, location);
        return `${baseUrl}hub/user-redirect/${gitPullURL}`;
      }
      case 'binderhub': {
        return makeBinderURL({ ...(binder ?? {}), url: baseUrl }, location);
      }
      case undefined: {
        return;
      }
    }
  }, [formRef, location, binder, detectedProviderType]);

  // FIXME: use ValidityState from radix-ui once passing-by-name is fixed
  const urlRef = useRef<HTMLInputElement>(null);
  const buildValidLink = useCallback(() => {
    if (urlRef.current?.dataset.invalid === 'true') {
      return;
    } else {
      return buildLink();
    }
  }, [buildLink, urlRef]);

  // Detect the provider type on debounced text input
  const debouncedURL = useDebounce(url, 100);
  const [isInterrogating, setIsInterrogating] = useState(false);
  React.useEffect(() => {
    // Check validity manually to ensure that we don't make requests that aren't sensible
    const urlIsValid = !!urlRef.current?.checkValidity?.();
    // Don't detect URL if it isn't valid
    if (!urlIsValid) {
      return;
    }

    // Enter interrogating state
    setIsInterrogating(true);

    // Interrogate remote endpoint
    let baseName;
    try {
      baseName = ensureBasename(debouncedURL);
    } catch (err) {
      return;
    }
    interrogateProviderType(baseName)
      .then((provider: ProviderType | 'error') => {
        if (provider !== 'error') {
          setDetectedProviderType(provider);
        }
        // Special case for mybinder.org
        else if (/https?:\/\/mybinder.org\//.test(baseName)) {
          setDetectedProviderType('binderhub');
        } else {
          setDetectedProviderType('error');
        }
      })
      .catch(console.error)
      // Clear the interrogating state
      .finally(() => setIsInterrogating(false));
  }, [debouncedURL, urlRef, setIsInterrogating]);

  const handleSubmit = useCallback(
    (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();

      const link = buildLink();

      // Link should exist, but guard anyway
      if (link) {
        window?.open(link, '_blank')?.focus();
      }
      onLaunch?.();
    },
    [defaultBinderBaseURL, buildLink, onLaunch],
  );

  return (
    <Form.Root onSubmit={handleSubmit} ref={formRef}>
      <Form.Field className="myst-fm-launch-field" name="url">
        <div className="myst-fm-launch-field-header">
          <Form.Label className="myst-fm-launch-label">
            Enter a JupyterHub or BinderHub URL, e.g.{' '}
            <a
              href="https://mybinder.org"
              className="myst-fm-launch-label-link"
            >
              https://mybinder.org
            </a>
          </Form.Label>
          <Form.Message className="myst-fm-launch-message" match="typeMismatch">
            Please provide a valid URL that starts with http(s).
          </Form.Message>
        </div>
        <div className="myst-fm-launch-input-container">
          <span className="myst-fm-launch-icon-container" aria-hidden>
            {(detectedProviderType === 'binderhub' && (
              <BinderIcon className="myst-fm-launch-icon" />
            )) ||
              (detectedProviderType === 'jupyterhub' && (
                <JupyterIcon className="myst-fm-launch-icon" />
              )) ||
              (detectedProviderType === 'error' && (
                <QuestionMarkCircledIcon className="myst-fm-launch-icon" />
              )) ||
              (isInterrogating && (
                <UpdateIcon className="myst-fm-launch-icon myst-fm-launch-icon-spinner" />
              )) || (
                <Link2Icon className="myst-fm-launch-icon" />
              )}
          </span>
          <Form.Control asChild>
            <input
              className="myst-fm-launch-input"
              type="url"
              placeholder={defaultBinderBaseURL}
              required
              ref={urlRef}
              onChange={onUrlChanged}
            />
          </Form.Control>
        </div>
      </Form.Field>

      <details
        className={classNames(
          'myst-fm-launch-details',
          { 'myst-fm-launch-details-hidden': !(detectedProviderType === 'jupyterhub' || detectedProviderType === 'error') },
        )}
        open={false}
      >
        <summary
          className="myst-fm-launch-summary"
        >
          <span className="myst-fm-launch-summary-text">
            <span className="myst-fm-launch-summary-indicator">
              <ChevronRightIcon
                width="1.5rem"
                height="1.5rem"
                className="myst-fm-launch-chevron"
              />
            </span>
            JupyterHub Requirements
          </span>
        </summary>
        <div className="myst-fm-launch-details-body">
          <p>
            Launching on a JupyterHub will usually require you to choose a "profile". You should
            select a profile that has the right packages, and enough resources to run the code-cells
            and inline expressions in this MyST project.
          </p>

          <p>
            Whichever image you choose, it must have the{' '}
            <a href="https://github.com/jupyterhub/nbgitpuller" className="underline">
              nbgitpuller
            </a>{' '}
            extension installed. If it is missing, you will see an HTTP 404 error once the server
            starts.
          </p>
          <p>
            Contact the Hub administrator for more information about using nbgitpuller with
            JupyterHub.
          </p>
        </div>
      </details>

      <fieldset
        disabled={detectedProviderType !== 'error'}
        className={classNames('myst-fm-launch-fieldset', { 'myst-fm-launch-fieldset-hidden': detectedProviderType !== 'error' })}
      >
        <legend className="myst-fm-launch-legend">
          The provider type could not be detected automatically. what kind of provider have you
          given?
        </legend>
        <div>
          <input
            id="jupyterhub"
            type="radio"
            name="provider"
            value="jupyterhub"
            className="mr-2"
            defaultChecked
          />
          <label className="cursor-pointer " htmlFor="jupyterhub">
            JupyterHub
          </label>
        </div>
        <div>
          <input id="binderhub" type="radio" name="provider" className="mr-2" value="binderhub" />
          <label className="cursor-pointer " htmlFor="binderhub">
            BinderHub
          </label>
        </div>
      </fieldset>

      <fieldset
        className={classNames('myst-fm-launch-buttons', {
          'myst-fm-launch-buttons-hidden': detectedProviderType === undefined,
        })}
        disabled={detectedProviderType === undefined}
      >
        <Form.Submit asChild>
          <button className="myst-fm-launch-submit">
            <span>Launch</span> <ExternalLinkIcon className="inline-block" />
          </button>
        </Form.Submit>

        <CopyButton
          className="myst-fm-launch-copy"
          defaultMessage="Copy Link"
          copiedMessage="Link Copied"
          buildLink={buildValidLink}
        />
      </fieldset>
    </Form.Root>
  );
}

export function LaunchButton(props: LaunchProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const closePopover = useCallback(() => {
    closeRef.current?.click?.();
  }, []);
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="myst-fm-launch-trigger"
          aria-label="Launch in external computing interface"
          title="Launch in external computing interface"
        >
          <RocketIcon />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="myst-fm-launch-popover"
          sideOffset={5}
        >
          <DetectLaunchContent {...props} onLaunch={closePopover} />
          <Popover.Close
            className="myst-fm-launch-close"
            aria-label="Close"
            ref={closeRef}
          >
            <Cross2Icon />
          </Popover.Close>
          <Popover.Arrow className="myst-fm-launch-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
