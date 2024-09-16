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
    <li {...listItemProps} class="sm:mix-blend-difference">
      <a class="block text-start text-2xl font-bold sm:text-base" href={href}>
        {text}
      </a>
    </li>
  );
};

export default NavbarListItem;
