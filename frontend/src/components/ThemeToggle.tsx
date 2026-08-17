import { Moon, Sun, Monitor } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTheme } from '../store/slices/themeSlice';
import type { Theme } from '../types';
import { Button } from './ui/Button';

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.theme);

  const themes: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  const handleThemeChange = () => {
    const currentIndex = themes.findIndex((t) => t.value === currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    dispatch(setTheme(themes[nextIndex].value));
  };

  const CurrentIcon = themes.find((t) => t.value === currentTheme)?.icon || Sun;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeChange}
      title={`Current theme: ${currentTheme}`}
    >
      <CurrentIcon className="h-5 w-5" />
    </Button>
  );
}
