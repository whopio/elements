import { createNamespaceReact } from './_runtime/react/namespace.js';
const __ns = createNamespaceReact(
  'tracking',
  [
    {
      key: 'people',
      events: ['onPeriodChanged', 'onAttributionModelChanged', 'onFiltersChanged', 'onSortChanged', 'onPersonOpened'],
    },
    { key: 'events', events: ['onPeriodChanged', 'onAttributionModelChanged', 'onFiltersChanged', 'onPersonOpened'] },
  ],
  [],
  [],
);
export const Tracking = __ns.HandleProvider;
export const useTracking = __ns.useHandle;
export const PeopleElement = __ns.components['people'];
export const EventsElement = __ns.components['events'];
