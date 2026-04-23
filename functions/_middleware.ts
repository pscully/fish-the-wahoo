import { legacyRedirects } from '../src/data/redirects-generated';

type Context = {
  request: Request;
  next: () => Promise<Response>;
};

export const onRequest = async (context: Context): Promise<Response> => {
  const url = new URL(context.request.url);
  const { pathname } = url;

  if (pathname === '/') return context.next();

  const lookupKey = pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;

  const legacyDestination = legacyRedirects[lookupKey];
  if (legacyDestination) {
    url.pathname = legacyDestination;
    return Response.redirect(url.toString(), 301);
  }

  if (pathname.endsWith('/')) return context.next();

  const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
  if (lastSegment.includes('.')) return context.next();

  url.pathname = pathname + '/';
  return Response.redirect(url.toString(), 301);
};
