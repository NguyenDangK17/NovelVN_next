'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Loading from '@/app/loading';

interface NavigationContextType {
  isNavigating: boolean;
  navigate: (url: string) => void;
  startNavigation: () => void;
  endNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  navigate: () => {},
  startNavigation: () => {},
  endNavigation: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Track navigation state
  useEffect(() => {
    // When the route changes, set isNavigating to false
    setIsNavigating(false);
  }, [pathname, searchParams]);

  // Custom navigation function that shows the loading screen
  const navigate = useCallback(
    (url: string) => {
      setIsNavigating(true);
      router.push(url);
    },
    [router]
  );

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
  }, []);

  const endNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  // Listen for navigation start events
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsNavigating(true);
    };

    // Add event listeners for navigation events
    window.addEventListener('beforeunload', handleRouteChangeStart);

    // This is a workaround since Next.js App Router doesn't expose navigation events directly
    // We'll use a MutationObserver to detect when navigation starts
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-busy') {
          const htmlElement = document.documentElement;
          if (htmlElement.getAttribute('aria-busy') === 'true') {
            handleRouteChangeStart();
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['aria-busy'],
    });

    // Add click event listener to capture link clicks
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.getAttribute('href') && !link.getAttribute('target')) {
        // Only show loading for internal links (not external links with target="_blank")
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('//')) {
          setIsNavigating(true);
        }
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('beforeunload', handleRouteChangeStart);
      document.removeEventListener('click', handleLinkClick);
      observer.disconnect();
    };
  }, []);

  return (
    <NavigationContext.Provider value={{ isNavigating, navigate, startNavigation, endNavigation }}>
      {isNavigating && <Loading />}
      {children}
    </NavigationContext.Provider>
  );
}
