import type {FunctionalComponent} from 'preact';

interface Props {
  onClick: () => void;
  isOpen: boolean;
}

const NavbarToggle: FunctionalComponent<Props> = ({onClick, isOpen}) => {
  return (
    <button
      className={`${isOpen ? 'open' : ''} group relative ml-auto h-[24px] w-[30px]`}
      onClick={onClick}>
      <span class="sr-only">Open main menu</span>
      <span
        aria-hidden="true"
        className="nav-icon-span top-0 group-[.open]:left-1/2 group-[.open]:top-[9px] group-[.open]:w-0"></span>
      <span
        aria-hidden="true"
        className="nav-icon-span top-[9px] group-[.open]:rotate-45"></span>
      <span
        aria-hidden="true"
        className="nav-icon-span top-[9px] group-[.open]:rotate-[-45deg]"></span>
      <span
        aria-hidden="true"
        className="nav-icon-span top-[18px] group-[.open]:left-1/2 group-[.open]:top-[9px] group-[.open]:w-0"></span>
    </button>
  );
};

export default NavbarToggle;
