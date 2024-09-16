import type {FunctionalComponent} from 'preact';
import {useState} from 'preact/hooks';
import {twMerge} from 'tailwind-merge';
import {useIsMobile} from '../hooks/use-is-mobile';
import {useIsScrolled} from '../hooks/use-is-scrolled';
import NavbarListItem from './navbar-list-item';
import NavbarToggle from './navbar-toggle';

const Navbar: FunctionalComponent = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const hasScrolled = useIsScrolled(100);

  // We use the mix-blend-mode CSS property to make sure the hamburger icon is visible on the video background.
  // We don't want it to effect the hamburger menu, so we render it at different positions based on the screen size.
  const Logo = ({customClass}: {customClass?: string}) => (
    <a
      href="/"
      aria-label="Skurrilum - Homepage"
      class={twMerge('pointer-events-auto', customClass)}>
      <h1 className="before:logo relative h-[32px] w-[64px] before:absolute before:inset-0 before:isolate">
        <span className="hidden">
          Skurrilum - Escape Room Hamburg Reeperbahn
        </span>
      </h1>
    </a>
  );

  return (
    <>
      <header
        className={twMerge(
          'fixed z-30 flex w-full items-center justify-between p-2 transition-all duration-100 before:absolute before:inset-0 before:isolate before:z-[-1] before:h-full before:w-full before:sm:hidden',
          hasScrolled
            ? 'before:bg-primary before:shadow-md'
            : 'before:bg-transparent',
          isOpen && 'before:bg-primary before:shadow-none'
        )}>
        {<Logo customClass="hidden-on-desktop" />}
        <NavbarToggle
          customClass="mix-blend-difference hidden-on-desktop"
          onClick={() => setIsOpen(prev => !prev)}
          isOpen={isOpen}
        />
      </header>
      <nav
        className={twMerge(
          'animate-display-none fixed bottom-0 left-0 right-0 top-0 z-10 hidden bg-transparent text-center opacity-0 ease-in sm:bottom-auto sm:block sm:opacity-100',
          isOpen ? 'pointer-events-auto block bg-primary opacity-100' : '',
          hasScrolled ? 'sm:bg-primary' : ''
        )}>
        <ul className="pointer-events-auto flex h-full flex-col items-center justify-center gap-16 sm:flex-row sm:flex-nowrap sm:gap-4 sm:p-4 sm:text-white">
          {<Logo customClass="hidden-on-mobile mr-auto" />}
          <NavbarListItem href="/" text="Home" />
          <NavbarListItem href="/" text="Unsere Räume" />
          <NavbarListItem href="/" text="Gruppen & Firmen" />
          <NavbarListItem href="/kontakt" text="Kontakt" />
          <NavbarListItem href="/" text="Die Macher" />
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
