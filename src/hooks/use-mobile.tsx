
import { useEffect, useState } from 'react';

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Set up event listener
    window.addEventListener('resize', checkScreenSize);

    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isMobile;
};
