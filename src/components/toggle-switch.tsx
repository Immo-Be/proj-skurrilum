import type {FunctionalComponent} from 'preact';
import {useEffect, useState} from 'preact/hooks';

const ThemeToggle: FunctionalComponent = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'light');

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button onClick={handleClick}>{theme === 'light' ? '🌞' : '🌙'}</button>
  );
};

export default ThemeToggle;
