import { isCallbackName } from './naming.js';

export const EVENT_HANDLERS_PROP = '__whopEventHandlers';
export const HANDLER_PRESENT = '__whopHandlerPresent';

export function eventHandlerNames(options: Record<string, unknown>): string {
  return Object.entries(options)
    .filter(
      ([key, value]) =>
        isCallbackName(key) && typeof value === 'function' && Reflect.get(value, HANDLER_PRESENT) !== false,
    )
    .map(([key]) => key)
    .sort()
    .join(',');
}
