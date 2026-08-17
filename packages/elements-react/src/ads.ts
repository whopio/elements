import { createNamespaceReact } from './_runtime/react/namespace.js';
const __ns = createNamespaceReact(
  'ads',
  [
    { key: 'billing-setup', events: [] },
    { key: 'campaign-creator', events: ['onExited', 'onLaunched'] },
  ],
  ['onBillingChanged'],
  [
    {
      key: 'reporting',
      events: ['onEditRequested'],
      children: [
        { key: 'chart', events: ['onMetricChanged', 'onTimezoneChanged', 'onPeriodChanged'] },
        {
          key: 'table',
          events: [
            'onTabChanged',
            'onFilterChanged',
            'onColumnsChanged',
            'onCustomMetricsChanged',
            'onViewChanged',
            'onSourcesChanged',
            'onAttributionModelChanged',
          ],
        },
      ],
    },
  ],
);
export const Ads = __ns.HandleProvider;
export const useAds = __ns.useHandle;
export const BillingSetupElement = __ns.components['billing-setup'];
export const CampaignCreatorElement = __ns.components['campaign-creator'];
export const Reporting = __ns.subs['reporting'].Provider;
export const ChartElement = __ns.subs['reporting'].components['chart'];
export const TableElement = __ns.subs['reporting'].components['table'];
