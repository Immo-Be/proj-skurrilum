import type {FunctionalComponent} from 'preact';
import {useState} from 'preact/hooks';
import {twMerge} from 'tailwind-merge';
import {useIsScrolled} from '../hooks/use-is-scrolled';
import NavbarListItem from './navbar-list-item';
import NavbarToggle from './navbar-toggle';

const Navbar: FunctionalComponent = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const hasScrolled = useIsScrolled(100);

  return (
    <>
      <header
        className={twMerge(
          'fixed z-30 flex w-full items-center justify-between p-2 transition-all duration-100',
          hasScrolled ? 'bg-primary shadow-md' : 'bg-transparent',
          isOpen && 'bg-primary shadow-none'
        )}>
        <h1 className="before:logo-svg relative h-[32px] w-[64px] before:absolute before:inset-0 before:isolate">
          <span className="hidden">
            Skurrilum - Escape Room Hamburg Reeperbahn
          </span>
          <a href="/" aria-label="Skurrilum Home"></a>
        </h1>
        <NavbarToggle
          customClass="mix-blend-difference"
          onClick={() => setIsOpen(prev => !prev)}
          isOpen={isOpen}
        />
      </header>
      <nav
        className={twMerge(
          'animate-display-none is-deleting pointer-events-none fixed bottom-0 left-0 right-0 top-0 z-10 hidden bg-primary text-center opacity-0 transition-opacity duration-200 ease-in',
          isOpen ? 'pointer-events-auto block opacity-100' : ''
        )}>
        <ul className="pointer-events-auto flex h-full flex-col items-center justify-center md:flex-row md:flex-nowrap">
          <NavbarListItem href="/" text="Home" />
          <NavbarListItem href="/" text="Unsere Räume" />
          <NavbarListItem href="/" text="Gruppen & Firmen" />
          <NavbarListItem href="/" text="Kontakt" />
          <NavbarListItem href="/" text="Die Macher" />
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
