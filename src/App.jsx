import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function getPage() {
  return window.location.hash.slice(1) || '/';
}

export default function App() {
  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const onHash = () => {
      setPage(getPage());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  switch (page) {
    case '/privacy':
      return <Privacy />;
    case '/terms':
      return <Terms />;
    default:
      return <Landing />;
  }
}
