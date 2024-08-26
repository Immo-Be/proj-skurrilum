// Make sure to import the CSS file
import type {FunctionalComponent} from 'preact';
import React from 'preact/compat';

const Navbar: FunctionalComponent = () => {
  return (
    <nav className="">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <button
          className="group relative h-[18px] w-[30px]"
          onClick={e => {
            e.currentTarget.classList.toggle('open');
            console.log(e, 'clicked');
          }}>
          <span className="nav-icon-span top-0 group-[.open]:left-1/2 group-[.open]:top-[9px] group-[.open]:w-0"></span>
          <span className="nav-icon-span top-[9px] group-[.open]:rotate-45"></span>
          <span className="nav-icon-span top-[9px] group-[.open]:rotate-[-45deg]"></span>
          <span className="nav-icon-span top-[18px] group-[.open]:left-1/2 group-[.open]:top-[9px] group-[.open]:w-0"></span>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
          <ul></ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
