import { useThemeSwitcher } from '@myst-theme/providers';
import { MoonIcon } from '@heroicons/react/24/solid';
import { SunIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

export function ThemeButton({ className = 'w-8 h-8 mx-3' }: { className?: string }) {
  const { nextTheme } = useThemeSwitcher();
  return (
    <button
      className={classNames(
        className,
        'myst-theme-button',
      )}
      title={`Toggle theme between light and dark mode`}
      aria-label={`Toggle theme between light and dark mode`}
      onClick={nextTheme}
    >
      <MoonIcon className="myst-theme-icon-moon" />
      <SunIcon className="myst-theme-icon-sun" />
    </button>
  );
}
