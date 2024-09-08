import type {FunctionComponent} from 'preact';
import React from 'preact/compat';

interface Props extends React.HTMLAttributes<HTMLLIElement> {
  href: string;
  text: string;
}

const NavbarListItem: FunctionComponent<Props> = ({
  href,
  text,
  ...listItemProps
}) => {
  return (
    <li {...listItemProps}>
      <a class="block px-4 py-6 text-start text-2xl font-bold" href={href}>
        {text}
      </a>
    </li>
  );
};

export default NavbarListItem;
