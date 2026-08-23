import { createNamespaceReact } from './_runtime/react/namespace.js';
const __ns = createNamespaceReact(
  'wallet',
  [
    { key: 'activity', events: ['onActivitySelected', 'onActivityHovered', 'onDateRangeChanged'] },
    {
      key: 'deposit',
      events: [
        'onDepositInitiated',
        'onCardDepositRequested',
        'onAddCardRequested',
        'onBankSelected',
        'onPlatformBalanceSelected',
        'onDepositConfirmed',
        'onStepChanged',
        'onDismissed',
      ],
    },
    {
      key: 'withdraw',
      events: [
        'onAmountChanged',
        'onCountryChanged',
        'onSupportedMethodChanged',
        'onAddMethodRequested',
        'onPlaidLinkRequested',
        'onMethodVerificationCompleted',
        'onRenameMethodRequested',
        'onRemoveMethodRequested',
        'onWithdrawalRequested',
        'onDone',
      ],
    },
    { key: 'send', events: ['onStepChanged', 'onSendCompleted', 'onLinkCreated', 'onDone'] },
    { key: 'cards', events: ['onCardSelected', 'onViewAllSelected', 'onAddCardRequested', 'onVerificationRequested'] },
  ],
  [],
  [
    {
      key: 'balances',
      events: [],
      children: [
        { key: 'balance', events: ['onRangeChanged', 'onRangeBrushed'] },
        { key: 'list', events: ['onBalanceSelected', 'onAccountSelected'] },
      ],
    },
  ],
);
export const Wallet = __ns.HandleProvider;
export const useWallet = __ns.useHandle;
export const ActivityElement = __ns.components['activity'];
export const DepositElement = __ns.components['deposit'];
export const WithdrawElement = __ns.components['withdraw'];
export const SendElement = __ns.components['send'];
export const CardsElement = __ns.components['cards'];
export const Balances = __ns.subs['balances'].Provider;
export const BalanceElement = __ns.subs['balances'].components['balance'];
export const ListElement = __ns.subs['balances'].components['list'];
