import { useThemeSwitcher } from '@myst-theme/providers';
import classNames from 'classnames';

export function ThemeButton({ className = 'w-8 h-8 mx-3' }: { className?: string }) {
    const { nextTheme } = useThemeSwitcher();
    return (
        <button
            className={classNames(
                'myst-theme-button theme rounded-full aspect-square border border-stone-700 dark:border-white hover:bg-neutral-100 border-solid overflow-hidden text-stone-700 dark:text-white hover:text-stone-500 dark:hover:text-neutral-800',
                className,
            )}
            title={`Toggle theme between light and dark mode`}
            aria-label={`Toggle theme between light and dark mode`}
            onClick={nextTheme}
        >
            <svg
                className="myst-theme-moon-icon h-full w-full p-0.5 hidden dark:block"
                xmlns="http://www.w3.org/2000/svg"
                width="100px"
                height="100px"
                viewBox="0 0 512 512"
                fill="#ffdb29"
                stroke="#ffdb29"
            >
                <g transform="rotate(190 256 256) translate(0, 10)">
                    <path d="M305.4 18.09A192 192 0 0 0 144.9 98c25.7-9.6 54.2-13.42 83.4-9.81 96.3 11.91 164.9 99.91 153 196.31-5.9 48-30.8 89.1-66.1 116.9a192 192 0 0 0 176.2-167.8A192 192 0 0 0 324.5 19.5a192 192 0 0 0-19.1-1.41z" />
                    <g transform="rotate(190 256 256) translate(180,-150)">
                        <path d="M317.1 301.3c-40.3.8-72.9 24.8-93.6 45.1 7.9 25.8 7.9 54-17.4 62l-16.7-37.2-8.7 16.9-16.7-8.8 7.2 40.2c-25.5 7.9-41.3-15.3-49.2-41-29.43-5-71.41-5.8-105.49 19.2 16.67 8.8 41.14 43.5 45.15 56.3 37.99-11.9 62.84 22.6 66.54 35.6 46.9-29 63.5-20.2 84.1 1.6 4.8-29.7 13.5-46.6 68.1-49.9-3.9-12.8-3.1-55.4 35-67.5-4-12.9-3.2-55.6 5.6-72.5h-3.9z" />
                    </g>
                </g>
            </svg>

            <svg
                className="myst-theme-sun-icon h-full w-full p-0.5 dark:hidden"
                xmlns="http://www.w3.org/2000/svg"
                width="100px"
                height="100px"
                viewBox="0 0 24 24"
                stroke="#dd7700"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
            >
                <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20" />
                <path d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" />
            </svg>
        </button>
    );
}
