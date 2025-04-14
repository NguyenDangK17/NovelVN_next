'use client';

import NextLink from 'next/link';
import { useNavigation } from '@/context/NavigationContext';
import { ComponentProps, forwardRef } from 'react';

export interface LinkProps extends ComponentProps<typeof NextLink> {}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ onClick, ...props }, ref) => {
  const { startNavigation } = useNavigation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Show loading indicator when link is clicked
    startNavigation();

    // Call the original onClick if it exists
    if (onClick) {
      onClick(e);
    }
  };

  return <NextLink ref={ref} onClick={handleClick} {...props} />;
});

Link.displayName = 'Link';

export default Link;
