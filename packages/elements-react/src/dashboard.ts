import { createNamespaceReact } from './_runtime/react/namespace.js';
const __ns = createNamespaceReact(
  'dashboard',
  [
    {
      key: 'paymentsTable',
      events: ['onPaymentSelected', 'onInvoiceRequested', 'onUserSelected', 'onRefundRequested', 'onSettingsRequested'],
    },
    {
      key: 'paymentDetail',
      events: [
        'onRefundRequested',
        'onRetryRequested',
        'onVoidRequested',
        'onInvoiceRequested',
        'onCustomerSelected',
        'onMessageRequested',
      ],
    },
  ],
  [],
  [],
);
export const Dashboard = __ns.HandleProvider;
export const useDashboard = __ns.useHandle;
export const PaymentsTableElement = __ns.components['paymentsTable'];
export const PaymentDetailElement = __ns.components['paymentDetail'];
