// Make sure to import the CSS file
import type {FunctionalComponent} from 'preact';
import NavbarToggle from './navbar-toggle';

const Navbar: FunctionalComponent = () => {
  return (
    <nav className="">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <NavbarToggle />
        <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
          <ul></ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
