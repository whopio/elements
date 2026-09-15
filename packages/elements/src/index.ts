/**
 * The published vanilla package's runtime: a tiny loader that pulls the (versioned) hosted SDK onto
 * the consumer page. This file is REAL source — typechecked here, then esbuild-bundled per format
 * (esm → index.js, cjs → index.cjs) with ORIGIN/SDK_URL define-injected at build time (same
 * technique as the boot shim). Never imported at runtime by this package.
 *
 * Classic <script> injection rather than a dynamic import() of an external URL — the pattern
 * hosted-SDK loaders converge on: bundler-agnostic (nothing for webpack/Vite to rewrite), works
 * without a bundler, and elements.js self-locates via document.currentScript. Dedupes + resolves
 * on load. NOTE: this file ships as readable source in the public mirror — its comments are
 * consumer-facing.
 */

const ORIGIN = 'https://js.whop.cloud';
const SDK_URL = 'https://js.whop.cloud/elements/amber/elements.js';

// the app's built locale set (default locale first), define-injected from the ratified config —
// the runtime value behind the generated `WhopElementsLocale` union, for validating dynamic strings.
const WHOP_ELEMENTS_LOCALES = ['en', 'es', 'zh', 'nl', 'pt', 'de', 'hu', 'it', 'fr', 'ja', 'pl', 'tr'];

type WhopWindow = Window & { WhopElements?: unknown };
type WhopScript = HTMLScriptElement & { __whopReady?: Promise<unknown> };

function loadWhop(): Promise<unknown> {
  if (typeof window === 'undefined') return Promise.reject(new Error('WhopElements requires a browser environment'));
  const w = window as WhopWindow;
  if (w.WhopElements) return Promise.resolve(w.WhopElements);
  let s = document.querySelector<HTMLScriptElement>('script[data-whop-elements]') as WhopScript | null;
  const created = !s;
  if (!s) {
    s = document.createElement('script') as WhopScript;
    s.src = SDK_URL;
    s.async = true;
    s.setAttribute('data-whop-elements', '');
    document.head.appendChild(s);
  }
  const script = s;
  // a tag we did NOT create (hand-added by the consumer) has no ready promise — adopt it.
  // Its load/error may have fired BEFORE adoption and will never re-fire, so the adopted
  // path also polls the global briefly and then fails loudly instead of hanging forever.
  // Our own tag keeps pure event semantics (no deadline — slow networks must not reject).
  if (!script.__whopReady) {
    script.__whopReady = new Promise((resolve, reject) => {
      let timer: ReturnType<typeof setInterval> | null = null;
      function settle<T>(fn: (v: T) => void, v: T): void {
        if (timer !== null) {
          clearInterval(timer);
          timer = null;
        }
        fn(v);
      }
      script.addEventListener('load', () => {
        if (w.WhopElements) settle(resolve, w.WhopElements);
        else settle(reject, new Error('WhopElements loaded but did not initialize'));
      });
      script.addEventListener('error', () => settle(reject, new Error('Failed to load ' + SDK_URL)));
      if (!created) {
        let waited = 0;
        timer = setInterval(() => {
          if (w.WhopElements) {
            settle(resolve, w.WhopElements);
            return;
          }
          waited += 200;
          if (waited >= 10000)
            settle(
              reject,
              new Error(
                'existing data-whop-elements script did not initialize within 10s — if its network load already failed before loadWhop() ran (check the console/CSP), no load/error event will ever fire on it',
              ),
            );
        }, 200);
      }
    });
  }
  return script.__whopReady;
}

// Resource hints for consumers who want to warm the SDK fetch from <head>. SDK_URL carries the
// train, so these auto-follow a major bump of this package — no hardcoded version to update.
function preloadHints(): { rel: string; href: string; as?: string }[] {
  return [
    { rel: 'preconnect', href: ORIGIN },
    { rel: 'preload', href: SDK_URL, as: 'script' },
  ];
}

export { SDK_URL, WHOP_ELEMENTS_LOCALES, loadWhop, preloadHints };
