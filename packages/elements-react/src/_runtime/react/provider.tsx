/**
 * `<WhopElements>` — the root of the React wrapper. It resolves the loaded
 * `WhopConstructor` (a function, or a promise of one, from the vanilla loader's
 * `loadWhop()`), invokes it with the global config, and puts the resulting `Whop` instance
 * + the live global config into context. Namespace handle providers read both from here.
 *
 * UI-free + element-UI-free: this only drives the imperative SDK. The types the consumer
 * sees come from the GENERATED react `.d.ts`; here everything is structurally typed.
 */
'use client';

import { createContext, createElement, useContext, useMemo, type ReactNode } from 'react';
// 16.8+ shim (not the 18+ react export) — this runs on the consumer's React; see namespace.tsx.
import { useSyncExternalStore } from 'use-sync-external-store/shim';

/** Global config drilled into every handle (live: appearance/locale propagate via update). */
export interface GlobalConfig {
  appearance?: unknown;
  locale?: string;
  /** Which Whop API environment the elements talk to — forwarded to the constructor (the
   *  published WhopElementsProps types it; dropping it here silently pinned production). */
  environment?: string;
  /** Whether elements may show toast notifications — forwarded to the constructor (the toast
   *  host registers there, first-root-wins; the same drop-here-and-it-silently-defaults class
   *  as `environment`). */
  toasts?: boolean;
  /** Override the origin serving the hosted element pages (local/staging). */
  baseUrl?: string;
}

/** A handle instance — the imperative surface installed by the host runtime. */
export type WhopHandle = Record<string, unknown> & {
  createElement(
    name: string,
    options?: Record<string, unknown>,
  ): { container: HTMLElement; destroy(): void; update(o: Record<string, unknown>): void } & Record<string, unknown>;
  update(options: Record<string, unknown>): void;
  /** controller loading state (grouped child readiness) — for the provider's fallback. */
  isLoading(): boolean;
  subscribeLoading(cb: () => void): () => void;
  /** seal the grouped loading when no element mounted eagerly. Optional: the react glue and
   *  the hosted runtime version independently, and an older elements.js predates the seal. */
  sealLoadingIfEmpty?(): void;
  teardown?(): void;
};
/** A namespace on the resolved instance: `create(opts)` boots a handle, plus each of the
 *  controller's STATIC actions (`WhopElements.<ns>.<action>`) dispatched with nothing mounted. The
 *  generated react `.d.ts` types the exact static-action set; here it's structural. */
type WhopNamespace = { create: (options?: Record<string, unknown>) => WhopHandle } & Record<
  string,
  (input?: unknown) => Promise<unknown>
>;
export type Whop = Record<string, WhopNamespace>;
export type WhopConstructor = (config?: Record<string, unknown>) => Whop;

/** What the consumer passes to `elements`: the factory, or a promise resolving to it. */
export type ElementsProp = WhopConstructor | PromiseLike<WhopConstructor | null> | null;

interface RootContextValue {
  root: Whop | null;
  config: GlobalConfig;
}

const RootContext = createContext<RootContextValue | null>(null);

/** Internal: the full context (root + live global config) — the per-namespace handle providers need
 *  both. Throws if used outside <WhopElements>. Not re-exported to consumers. */
export function useRootContext(): RootContextValue {
  const ctx = useContext(RootContext);
  if (!ctx) throw new Error('Whop Elements components must be used within <WhopElements>');
  return ctx;
}

/** The resolved Whop instance, or `null` while the loader promise is still pending. Throws if
 *  used outside <WhopElements>. */
export function useWhop(): Whop | null {
  return useRootContext().root;
}

/** What useSyncExternalStore tracks: the resolved constructor, or a captured load error. */
interface LoaderState {
  ctor: WhopConstructor | null;
  error: Error | null;
}
/** Stable "pending" snapshot — a module constant so the SSR/initial snapshot is referentially stable. */
const PENDING: LoaderState = { ctor: null, error: null };

/** A `useSyncExternalStore`-compatible holder for a (maybe-pending) constructor promise. Resolves to
 *  the constructor, or captures a load FAILURE so the provider can surface it (instead of hanging). */
class LoaderStore {
  private subscribers = new Set<() => void>();
  private state: LoaderState = PENDING;

  constructor(prop: ElementsProp) {
    // explicit `null` is a legal deferred-init value — stay pending, mount nothing.
    if (prop === null) return;
    Promise.resolve(prop)
      .then((ctor) => this.set({ ctor: ctor ?? null, error: null }))
      .catch((e) =>
        this.set({ ctor: null, error: e instanceof Error ? e : new Error('Failed to load Whop Elements') }),
      );
  }

  private set(state: LoaderState): void {
    this.state = state;
    for (const s of this.subscribers) s();
  }

  subscribe = (listener: () => void): (() => void) => {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  };

  getSnapshot = (): LoaderState => this.state;
}

export function WhopElements({
  children,
  elements,
  appearance,
  locale,
  environment,
  toasts,
  baseUrl,
}: { children: ReactNode; elements: ElementsProp } & GlobalConfig): ReactNode {
  // new store per `elements` identity; resolves the (possibly async) constructor or its failure.
  const store = useMemo(() => new LoaderStore(elements), [elements]);
  const { ctor, error } = useSyncExternalStore(store.subscribe, store.getSnapshot, () => PENDING);

  // the root carries environment/baseUrl (load-time origin selection — "cannot change after
  // load") and toasts (the toast host registers at construction, first-root-wins — a later
  // flip cannot take effect by design), so it's recreated only when those change;
  // appearance/locale are live and reach handles via the config below (create + update),
  // not a new root.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const root = useMemo(
    () => (ctor ? ctor({ appearance, locale, environment, toasts, baseUrl }) : null),
    [ctor, environment, toasts, baseUrl],
  );

  const config = useMemo<GlobalConfig>(
    () => ({ appearance, locale, environment, toasts, baseUrl }),
    [appearance, locale, environment, toasts, baseUrl],
  );
  const value = useMemo<RootContextValue>(() => ({ root, config }), [root, config]);

  // guards AFTER the hooks (so hook order is stable): a MISSING `elements` prop is a mistake (forgot
  // the loader) → throw; explicit `null` stays deferred (pending). A failed load surfaces to the
  // nearest error boundary instead of hanging forever in "loading".
  if (elements === undefined)
    throw new Error(
      '<WhopElements> requires an `elements` prop — pass loadWhop() (or its resolved value); use `null` to defer.',
    );
  if (error) throw error;

  return createElement(RootContext.Provider, { value }, children);
}
