# @whop/elements

Embed Whop in any site. Elements are hosted, themeable UI components across Whop's
product surface, with the catalog growing steadily. This package is a tiny loader plus
the full typed API: the element code itself is served from Whop's CDN and stays up to
date without you re-installing anything.

```ts
import { loadWhop } from '@whop/elements';

const whop = (await loadWhop())({ locale: 'en' });
```

Every element group hangs off the instance — create a handle, mount elements, listen to
events. The full catalog, live demos, and per-element API live in the docs.

Or warm the script from your document head:

```ts
import { preloadHints } from '@whop/elements';
// render as <link> tags: [{ rel: 'preconnect', ... }, { rel: 'preload', ... }]
```

Using React? [`@whop/elements-react`](https://www.npmjs.com/package/@whop/elements-react)
wraps the same elements as components.

## Documentation

https://docs.whop.com/elements/latest
