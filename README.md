# next-csrf

A robust CSRF protection library for Next.js. Easily configure, generate, and validate CSRF tokens with flexible options and built-in cookie management. Ensure secure request handling by integrating seamless middleware functions for your Next.js applications.

## Installation

```bash
npm i @se-oss/next-csrf
```

## Integration

First create a really random string and assign it to the `NEXT_CSRF_SECRET` environment variable.

```text
// .env.local
##
# You can use the following to generate a random string
# openssl rand -base64 32
##
NEXT_CSRF_SECRET=""
```

Then update your [`Middleware`](https://nextjs.org/docs/app/building-your-application/routing/middleware) with the following:

```typescript
import { configureCSRF, withCSRFProtection } from '@se-oss/next-csrf';
import { NextResponse, type NextRequest } from 'next/server';

configureCSRF({
  matcher: [
    /**
     * (default) Protect Everything every route expect:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - request methods - GET, HEAD, OPTIONS
     */
    {
      pattern:
        /^\/((?!_next\/static|_next\/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)/,
      ignoredMethods: ['GET', 'HEAD', 'OPTIONS']
    },
    // Strictly protect API routes.
    {
      pattern: /^\/api\/.*/,
      ignoredMethods: false
    }
  ],
  csrfErrorMessage: 'CSRF Verification Failed.',
  cookieOptions: {
    domain:
      process.env.NODE_ENV === 'production' ? '.example.com' : 'localhost',
    maxAge: 60 * 60 * 24 // 1 day
  }
});

export default withCSRFProtection(async (req: NextRequest) => {
  return NextResponse.next();
});
```

Now you are all set! You can test it with following `curl` commands:

```bash
$ curl --request GET 'http://localhost:3000/api/protected'

# Response
# CSRF Verification Failed.

$ curl --request GET 'http://localhost:3000/api/protected' \
  --cookie "next-csrf=FIehA1zS-LPbO2NcJksFJCUkbn89fUWS33qarn_B98PU2olbG-j0"

# Response
# {"message":"Hello, Next.js!"}
```

## Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/next-csrf).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi)
