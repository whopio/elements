# @whop/elements-react

React components for Whop elements — hosted, themeable UI components across Whop's
product surface, with the catalog growing steadily. Declarative wrappers over
[`@whop/elements`](https://www.npmjs.com/package/@whop/elements): the element code is
served from Whop's CDN and stays up to date without you re-installing anything.

```tsx
import { WhopElements, Tips, PickerElement } from '@whop/elements-react';
import { loadWhop } from '@whop/elements';

<WhopElements elements={loadWhop()}>
  <Tips creatorName="Ava the Artist">
    <PickerElement />
  </Tips>
</WhopElements>;
```

Everything imports from the package root; props and event callbacks are fully typed, with
usage examples and docs links on every symbol's hover.

## Documentation

https://docs.whop.com/elements/latest
