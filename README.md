# Whop Elements

Embeddable Whop UI components — Stripe-Elements-style building blocks for payments and commerce on [Whop](https://whop.com).

| Package | What it is |
|---|---|
| [`@whop/elements`](https://www.npmjs.com/package/@whop/elements) | Vanilla JS loader + types — loads the hosted SDK and exposes the typed `WhopElements` factory |
| [`@whop/elements-react`](https://www.npmjs.com/package/@whop/elements-react) | React components — declarative wrappers around the element SDK |

> **Status: pre-release.** The first packages have not shipped yet — install instructions below go live with the first release.

## Install

```bash
npm install @whop/elements        # vanilla
npm install @whop/elements-react  # React (peer-depends on @whop/elements)
```

## Docs

https://docs.whop.com/sdk/elements

## About this repository

This is a **read-only release mirror and issue tracker**. Development happens in Whop's monorepo; CI pushes every published release here — the exact package contents that went to npm, plus their changelogs — so releases can be read and diffed in one place.

- **Issues are welcome** — this is the official issue tracker for both packages.
- **Pull requests can't be accepted here** — the source of truth lives elsewhere; PRs against this mirror will be closed.
