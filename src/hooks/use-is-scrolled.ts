import {useState, useEffect} from 'preact/hooks';

export function useIsScrolled(y = 0): boolean {
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > y);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [y]);

  return hasScrolled;
}
