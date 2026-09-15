/**
 * Tiny helpers for the React wrapper runtime. React (external) plus same-package leaf
 * modules only — no internal WORKSPACE dep — so the whole `@local/elements-framework/react`
 * subtree bundles cleanly into the published react-js package.
 */
'use client';

import { useEffect, useRef } from 'react';

import { EVENT_HANDLERS_PROP, HANDLER_PRESENT } from '../builder/event-handlers.js';
import { isCallbackName } from '../builder/naming.js';
import { shallowEqual } from '../builder/shallow-equal.js';

/**
 * The DATA slice of a props bag: every `on[A-Z]` key is stripped REGARDLESS of value — callbacks
 * never ride `update()`; they are delivered through the stable live wrappers reading `latest`.
 * The value check matters: `onX={undefined}` (a conditionally-absent JSX callback) riding as
 * DATA would clobber the stable wrapper in the SDK's options bag permanently — events silently
 * stop even after the consumer passes a real callback again (the wrappers install only at
 * create). The builder bans authored `on[A-Z]` data props, so nothing legitimate is lost.
 */
function dataOptions(props: Record<string, unknown>, callbackKeys?: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (isCallbackName(k)) continue;
    out[k] = v;
  }
  if (callbackKeys)
    out[EVENT_HANDLERS_PROP] = callbackKeys
      .filter((key) => typeof props[key] === 'function')
      .sort()
      .join(',');
  return out;
}

/**
 * Stable wrapper callbacks that always read the LATEST consumer callback from a ref.
 * Created once (at element create); their identity never changes across re-renders,
 * so the underlying SDK keeps a single stable `onX` while the consumer is free to
 * pass inline closures.
 */
function liveCallbacks(
  keys: string[],
  latest: { current: Record<string, unknown> },
): Record<string, (...args: unknown[]) => void> {
  const out: Record<string, (...args: unknown[]) => void> = {};
  for (const k of keys) {
    out[k] = (...args: unknown[]) => {
      const fn = latest.current[k];
      if (typeof fn === 'function') (fn as (...a: unknown[]) => void)(...args);
    };
    Object.defineProperty(out[k], HANDLER_PRESENT, { get: () => typeof latest.current[k] === 'function' });
  }
  return out;
}

/**
 * The shared live-handle lifecycle used by both the handle provider and the element
 * components: a `latest` props ref (read by the stable callback wrappers so inline
 * closures stay live without re-creating), a create-once memo keyed on `dep`, and a
 * shallowEqual-guarded effect that pushes DATA-only updates (callbacks excluded — they
 * never force an update). `create` receives the current data options, the stable
 * wrappers for `callbackKeys`, and the `latest` ref (for wiring extra callbacks like
 * onReady/onError). An optional `destroy` runs on unmount / handle change.
 */
export function useLiveHandle<T extends { update(options: Record<string, unknown>): void }>(
  props: Record<string, unknown>,
  callbackKeys: string[],
  dep: unknown,
  create: (
    options: Record<string, unknown>,
    live: Record<string, (...args: unknown[]) => void>,
    latest: { current: Record<string, unknown> },
  ) => T | null,
  destroy?: (handle: T) => void,
  trackEventHandlers = false,
): T | null {
  const latest = useRef<Record<string, unknown>>(props);
  latest.current = props;

  // created once per `dep`; data changes flow through the guarded update below, callbacks
  // stay live via the stable wrappers (which read `latest`), so they never force update().
  // Ref-cached lazy init instead of useMemo: StrictMode double-invokes useMemo calculations,
  // which would create (and leak) a second live element — and trip the one-consumer-instance
  // guard. The ref guard runs `create` exactly once per `dep`.
  const cache = useRef<{ dep: unknown; handle: T | null } | null>(null);
  if (cache.current === null || cache.current.dep !== dep) {
    cache.current = {
      dep,
      handle: create(
        dataOptions(latest.current, trackEventHandlers ? callbackKeys : undefined),
        liveCallbacks(callbackKeys, latest),
        latest,
      ),
    };
  }
  const handle = cache.current.handle;

  const prev = useRef<Record<string, unknown> | null>(null);
  useEffect(() => {
    if (!handle) return;
    const options = dataOptions(latest.current, trackEventHandlers ? callbackKeys : undefined);
    if (prev.current && shallowEqual(prev.current, options)) return;
    prev.current = options;
    handle.update(options);
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => (handle && destroy ? () => destroy(handle) : undefined), [handle]);

  return handle;
}
