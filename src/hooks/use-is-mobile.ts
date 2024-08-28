import {useState, useEffect} from 'preact/hooks';

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to determine if the current device is a mobile device based on the window width.
 * @returns {boolean} Returns true if the current device is a mobile device, otherwise false.
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    // Function to update isMobile value when window is resized
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Attach the event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};
