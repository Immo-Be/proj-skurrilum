// Make sure to import the CSS file
import type {FunctionalComponent} from 'preact';
import {useState} from 'preact/hooks';
import Logo from '../assets/logo.png';
// import {useIsMobile} from '../hooks/use-is-mobile';
import NavbarListItem from './navbar-list-item';
import NavbarToggle from './navbar-toggle';

const Navbar: FunctionalComponent = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const isMobile = useIsMobile();
  return (
    <>
      <div className="absolute z-20 flex w-full items-center justify-between bg-transparent p-4">
        <img src={Logo.src} class={`h-8 ${isOpen && 'hidden'}`} />
        {
          <NavbarToggle
            onClick={() => setIsOpen(prev => !prev)}
            isOpen={isOpen}
          />
        }
      </div>
      <nav
        className={`bg-primary pointer-events-none fixed bottom-0 left-0 right-0 top-0 z-10 text-center opacity-0 transition-opacity duration-500 ease-in ${
          isOpen ? 'opacity-[0.98]' : ''
        }`}>
        <ul className="pointer-events-auto flex h-full items-center justify-center md:flex-row md:flex-nowrap">
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
