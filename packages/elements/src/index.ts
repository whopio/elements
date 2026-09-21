/**
 * The published vanilla package's runtime: a tiny loader that pulls the (versioned) hosted SDK onto
 * the consumer page. This file is REAL source — typechecked here, then esbuild-bundled per format
 * (esm → index.js, cjs → index.cjs) with ORIGIN/SDK_URL define-injected at build time (same
 * technique as the boot shim). Never imported at runtime by this package.
 *
 * Classic <script> injection rather than a dynamic import() of an external URL — the pattern
 * hosted-SDK loaders converge on: bundler-agnostic (nothing for webpack/Vite to rewrite), works
 * without a bundler, and elements.js self-locates via document.currentScript. One promise per tag,
 * handed back by every call — loading, loaded, or failed — until the promise's own retry() asks for
 * a fresh one. NOTE: this file ships as readable source in the public mirror — its comments are
 * consumer-facing.
 */

const ORIGIN = 'https://cdn.whop.com';
const SDK_URL = 'https://cdn.whop.com/elements/amber/elements.js';

// the app's built locale set (default locale first), define-injected from the ratified config —
// the runtime value behind the generated `WhopElementsLocale` union, for validating dynamic strings.
const WHOP_ELEMENTS_LOCALES = ['en', 'es', 'zh', 'nl', 'pt', 'de', 'hu', 'it', 'fr', 'ja', 'pl', 'tr'];

const TAG = 'script[data-whop-elements]';

type WhopWindow = Window & { WhopElements?: unknown };
/** The promise loadWhop() returns: the load itself, plus retry() for a fresh load after a failure. */
type WhopLoad = Promise<unknown> & { retry(): WhopLoad };
type WhopScript = HTMLScriptElement & { __whopReady?: WhopLoad; __whopFailed?: true };

// The SDK present with no tag to hang the promise on (loaded some other way): one promise, so a
// page that calls loadWhop() on every render keeps seeing the same object.
let resolved: WhopLoad | null = null;

function withRetry(promise: Promise<unknown>): WhopLoad {
  return Object.assign(promise, { retry: retryWhop });
}

function loadWhop(): WhopLoad {
  if (typeof window === 'undefined')
    return withRetry(Promise.reject(new Error('WhopElements requires a browser environment')));
  const w = window as WhopWindow;
  const existing = document.querySelector<HTMLScriptElement>(TAG) as WhopScript | null;
  // the tag's promise, whatever state it is in: the same object on every call, so nothing that
  // keys on identity (the react provider does) sees a change until retry() makes one.
  if (existing?.__whopReady) return cached(existing);
  if (w.WhopElements) return (resolved ??= withRetry(Promise.resolve(w.WhopElements)));
  return watch(w, existing ?? inject(), !existing);
}

// An older copy of this loader on the same page caches a plain promise on the tag, without
// retry() and without marking the tag on failure. Give it both in place, so the object every
// caller already holds keeps its identity and a retry through this copy still works. Its state is
// unknown until it settles, so a retry asked before then waits for the verdict: a resolution is
// the load, a rejection marks the tag dead and replaces it.
function cached(script: WhopScript): WhopLoad {
  const ready = script.__whopReady as WhopLoad;
  if (typeof ready.retry !== 'function') {
    let settled = false;
    ready.then(
      () => {
        settled = true;
      },
      () => {
        settled = true;
        script.__whopFailed = true;
      },
    );
    Object.assign(ready, {
      retry: (): WhopLoad =>
        settled
          ? retryWhop()
          : withRetry(
              ready.then(
                (value) => value,
                () => retryWhop(),
              ),
            ),
    });
  }
  return ready;
}

// A fresh attempt after a failure: the dead tag — the browser never retries a <script> whose load
// failed — is replaced in place by a new one carrying its src, nonce, crossorigin, integrity and
// referrer policy. While a load is in flight or has succeeded, this is just loadWhop().
function retryWhop(): WhopLoad {
  if (typeof window === 'undefined') return loadWhop();
  const dead = document.querySelector<HTMLScriptElement>(TAG) as WhopScript | null;
  if (!dead?.__whopFailed) return loadWhop();
  return watch(window as WhopWindow, inject(dead), true);
}

function inject(replacing?: WhopScript): WhopScript {
  const s = document.createElement('script') as WhopScript;
  s.src = replacing?.src || SDK_URL;
  s.async = true;
  s.setAttribute('data-whop-elements', '');
  if (replacing) {
    if (replacing.nonce) s.nonce = replacing.nonce;
    if (replacing.crossOrigin) s.crossOrigin = replacing.crossOrigin;
    if (replacing.integrity) s.integrity = replacing.integrity;
    if (replacing.referrerPolicy) s.referrerPolicy = replacing.referrerPolicy;
    replacing.replaceWith(s);
  } else {
    document.head.appendChild(s);
  }
  return s;
}

// What Resource Timing lets this page see about a script URL. The status needs a
// Timing-Allow-Origin header from the host; without it only the duration is visible.
function measured(src: string): string {
  const entry = performance.getEntriesByName(src).pop() as PerformanceResourceTiming | undefined;
  if (!entry) return '';
  const after = `after ${Math.round(entry.duration)}ms`;
  return entry.responseStatus ? ` (HTTP ${entry.responseStatus} ${after})` : ` (${after}, no status visible)`;
}

// a tag we did NOT create (hand-added by the consumer) has no ready promise — adopt it.
// Its load/error may have fired BEFORE adoption and will never re-fire, so the adopted
// path also polls the global briefly and then fails loudly instead of hanging forever.
// Our own tag keeps pure event semantics (no deadline — slow networks must not reject).
function watch(w: WhopWindow, script: WhopScript, created: boolean): WhopLoad {
  if (!script.__whopReady) {
    script.__whopReady = withRetry(
      new Promise<unknown>((resolve, reject) => {
        let timer: ReturnType<typeof setInterval> | null = null;
        function settle<T>(fn: (v: T) => void, v: T): void {
          if (timer !== null) {
            clearInterval(timer);
            timer = null;
          }
          fn(v);
        }
        function fail(message: string): void {
          script.__whopFailed = true;
          settle(reject, new Error(message));
        }
        script.addEventListener('load', () => {
          if (w.WhopElements) settle(resolve, w.WhopElements);
          else fail('WhopElements loaded but did not initialize');
        });
        script.addEventListener('error', () => fail('Failed to load ' + script.src + measured(script.src)));
        if (!created) {
          let waited = 0;
          timer = setInterval(() => {
            if (w.WhopElements) {
              settle(resolve, w.WhopElements);
              return;
            }
            waited += 200;
            if (waited >= 10000)
              fail(
                'existing data-whop-elements script did not initialize within 10s — if its network load already failed before loadWhop() ran (check the console/CSP), no load/error event will ever fire on it',
              );
          }, 200);
        }
      }),
    );
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
