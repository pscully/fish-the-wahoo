import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TrailingSlashNormalizer() {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === '/' || pathname.endsWith('/')) return;
    const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
    if (lastSegment.includes('.')) return;
    navigate(pathname + '/' + search + hash, { replace: true });
  }, [pathname, search, hash, navigate]);

  return null;
}
