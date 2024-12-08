import {defineMiddleware, sequence} from 'astro:middleware';

import {middleware} from 'astro:i18n'; // Astro's own i18n routing config

export const userMiddleware = defineMiddleware(async (ctx, next) => {
  // this response might come from Astro's i18n middleware, and it might return a 404
  const response = await next();

  console.log(
    '🚀 ~ middleware:',
    await middleware({
      redirectToDefaultLocale: true,
      prefixDefaultLocale: false,
      fallbackType: 'rewrite',
    })
  );

  //   console.log('ULoremser middleware', ctx.url);
  // Get search params from URL
  //   const searchParams = new URLSearchParams(ctx.url.search);
  //   console.log('🚀 ~ searchParams:', ctx);

  if (ctx.url.pathname === '/de' || ctx.url.pathname === '/de/') {
    // Redirect to /
    // console.log('condition true');

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  }

  //   console.log('🚀 ~ next:', await next());

  return response;
  //   console.log('🚀 ~ response:', response);

  //   return response;
  //     {
  //   // the /about page is an exception and we want to render it
  //   //   if (ctx.url.toString().includes('/about')) {
  //   //     return new Response();
  //   //   } else {
  //   //     return response;
  //   //   }
});

export const onRequest = sequence(
  userMiddleware,
  middleware({
    redirectToDefaultLocale: true,
    prefixDefaultLocale: false,
    fallbackType: 'rewrite',
  })
);
