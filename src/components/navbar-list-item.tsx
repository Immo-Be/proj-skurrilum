import type {FunctionComponent} from 'preact';
import React from 'preact/compat';
import {twMerge} from 'tailwind-merge';

interface BaseProps extends React.HTMLAttributes<HTMLLIElement> {
  href: string;
  customClass?: string;
}

interface TextProps extends BaseProps {
  text: string;
  children?: never;
}

interface ChildrenProps extends BaseProps {
  text?: never;
  children: React.ReactNode;
}

type Props = TextProps | ChildrenProps;

const NavbarListItem: FunctionComponent<Props> = ({
  href,
  text,
  children,
  customClass,
  ...listItemProps
}) => {
  return (
    <li
      {...listItemProps}
      class={twMerge('sm:mix-blend-difference', customClass)}>
      <a class="block text-start text-2xl font-bold sm:text-base" href={href}>
        {text || children}
      </a>
    </li>
  );
};

export default NavbarListItem;
