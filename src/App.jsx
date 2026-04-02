import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Landing from './pages/Landing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

const NavigateContext = createContext(null);

export function useNavigate() {
  return useContext(NavigateContext);
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  const navigate = useCallback((to) => {
    window.history.pushState(null, '', to);
    setPath(to);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  let page;
  switch (path) {
    case '/privacy':
      page = <Privacy />;
      break;
    case '/terms':
      page = <Terms />;
      break;
    default:
      page = <Landing />;
  }

  return (
    <NavigateContext.Provider value={navigate}>
      {page}
    </NavigateContext.Provider>
  );
}
