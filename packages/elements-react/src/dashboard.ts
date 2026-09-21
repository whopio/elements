import { createNamespaceReact } from './_runtime/react/namespace.js';
const __ns = createNamespaceReact(
  'dashboard',
  [
    { key: 'required-actions', events: ['onActionRequested', 'onIdentityVerificationRequested', 'onDepositRequested'] },
    { key: 'verification', events: ['onVerificationRequested'] },
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
export const RequiredActionsElement = __ns.components['required-actions'];
export const VerificationElement = __ns.components['verification'];
export const PaymentsTableElement = __ns.components['paymentsTable'];
export const PaymentDetailElement = __ns.components['paymentDetail'];
