Prisma seems to have issues running with SvelteKit when generating the client to some other location other than the default.

Consider a schema.prisma like this in a SvelteKit app, where I'm specifying an alternate location for the client:
```
generator client {
  provider = "prisma-client-js"
  output = "../node_modules/custom-client-location"
}
...(datasource/models omitted)
```

Then I use the generated client in my application code like this:
```js
import {PrismaClient} from 'custom-client-location'
const prisma = new PrismaClient()
```

When running a production build for the app, the following error will show:
```
ReferenceError: __dirname is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/<sveltekit-project-dir>/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
    at file:///<sveltekit-project-dir>/build/server/chunks/2-6f7b7120.js:19960:27
    at file:///<sveltekit-project-dir>/build/server/chunks/2-6f7b7120.js:31969:3
    at ModuleJob.run (node:internal/modules/esm/module_job:198:25)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:385:24)
    at async Promise.all (index 1)
    at async render_page (file:///<sveltekit-project-dir>/build/server/index.js:2382:19)
    at async resolve (file:///<sveltekit-project-dir>/build/server/index.js:2872:22)
    at async respond (file:///<sveltekit-project-dir>/build/server/index.js:2910:22)
    at async Array.ssr (file:///<sveltekit-project-dir>/build/handler.js:19060:3)
```

## Notes:
* This issue does not happen when running `vite dev` or `vite preview` for some reason. Prisma works as expected under those conditions. The error only happens when running the build output directly with node.
* If you remove the `output` option from the generator, then import the prisma client from '@prisma/client', Prisma will run as expected - but unfortunately that doesn't meet my needs.
* **Reason for this use case**: I need to connect to multiple schemas, and I want the benefit of prisma's generated types for both. As far as I know, the only way to connect to multiple schemas is to generate multiple prisma clients - which in turn means I can't use '@prisma/client' because that package will only point to one client at a time. (When generating multiple clients to the default location, they will just overwrite each other)
