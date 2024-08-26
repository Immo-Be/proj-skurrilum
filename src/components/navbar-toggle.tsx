import type {FunctionalComponent} from 'preact';
import React from 'preact/compat';

const NavbarToggle: FunctionalComponent = () => {
  return (
    <button
      className="group relative h-[18px] w-[30px]"
      onClick={e => {
        e.currentTarget.classList.toggle('open');
      }}>
      <span className="nav-icon-span top-0 group-[.open]:left-1/2 group-[.open]:top-[9px] group-[.open]:w-0"></span>
      <span className="nav-icon-span top-[9px] group-[.open]:rotate-45"></span>
      <span className="nav-icon-span top-[9px] group-[.open]:rotate-[-45deg]"></span>
      <span className="nav-icon-span top-[18px] group-[.open]:left-1/2 group-[.open]:top-[9px] group-[.open]:w-0"></span>
      ;
    </button>
  );
};

export default NavbarToggle;
