import React, { useEffect, Fragment } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  useEffect(() => {
      if (!window.location.href.includes('/templates')) {
        window.scrollTo(0, 0);
      }
  }, [location]);

  return <Fragment>{children}</Fragment>;
}

export default ScrollToTop;