import { createNamespaceReact } from './_runtime/react/namespace.js';
const __ns = createNamespaceReact(
  'wallet',
  [
    { key: 'required-actions', events: ['onActionRequested', 'onIdentityVerificationRequested', 'onDepositRequested'] },
    {
      key: 'actions',
      events: [
        'onDepositRequested',
        'onAcceptRequested',
        'onSendRequested',
        'onWithdrawRequested',
        'onConvertRequested',
      ],
    },
    { key: 'activity', events: ['onActivitySelected', 'onActivityHovered', 'onSeeAllRequested', 'onDateRangeChanged'] },
    { key: 'activityDetail', events: ['onCardSelected', 'onCardholderSelected', 'onCardTransactionIssueRequested'] },
    {
      key: 'deposit',
      events: [
        'onDepositInitiated',
        'onCardDepositRequested',
        'onAddCardRequested',
        'onBankSelected',
        'onIdentityVerificationRequested',
        'onPlatformBalanceSelected',
        'onDepositConfirmed',
        'onStepChanged',
        'onDismissed',
      ],
    },
    { key: 'convert', events: ['onViewChanged', 'onBalanceChanged', 'onDone'] },
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
        'onPayoutQuoteRequested',
        'onWithdrawalRequested',
        'onDone',
      ],
    },
    { key: 'send', events: ['onStepChanged', 'onSendCompleted', 'onLinkCreated', 'onDone'] },
    {
      key: 'cardDetails',
      events: [
        'onTransactionSelected',
        'onAllTransactionsRequested',
        'onTopUpRequested',
        'onCloseRequested',
        'onMenuRequested',
      ],
    },
    { key: 'verification', events: ['onVerificationRequested'] },
  ],
  [],
  [
    {
      key: 'balances',
      events: [],
      children: [
        { key: 'balance', events: ['onRangeChanged', 'onRangeBrushed'] },
        { key: 'breakdown', events: ['onBreakdownSelected'] },
        { key: 'settlement', events: [] },
        { key: 'list', events: ['onBalanceSelected', 'onAccountSelected'] },
      ],
    },
    {
      key: 'cards',
      events: [],
      children: [
        {
          key: 'cards',
          events: ['onCardSelected', 'onViewAllSelected', 'onAddCardRequested', 'onVerificationRequested'],
        },
        { key: 'cardsTable', events: ['onCardSelected', 'onCreateCardRequested'] },
        { key: 'cardsChart', events: ['onPeriodChanged', 'onDateSelected'] },
        { key: 'whopCard', events: ['onDetailsChanged', 'onLockRequested', 'onLockChanged', 'onAppleWalletRequested'] },
        { key: 'cardTransactions', events: ['onTransactionSelected'] },
      ],
    },
  ],
);
export const Wallet = __ns.HandleProvider;
export const useWallet = __ns.useHandle;
export const RequiredActionsElement = __ns.components['required-actions'];
export const ActionsElement = __ns.components['actions'];
export const ActivityElement = __ns.components['activity'];
export const ActivityDetailElement = __ns.components['activityDetail'];
export const DepositElement = __ns.components['deposit'];
export const ConvertElement = __ns.components['convert'];
export const WithdrawElement = __ns.components['withdraw'];
export const SendElement = __ns.components['send'];
export const CardDetailsElement = __ns.components['cardDetails'];
export const VerificationElement = __ns.components['verification'];
export const Balances = __ns.subs['balances'].Provider;
export const BalanceElement = __ns.subs['balances'].components['balance'];
export const BreakdownElement = __ns.subs['balances'].components['breakdown'];
export const SettlementElement = __ns.subs['balances'].components['settlement'];
export const ListElement = __ns.subs['balances'].components['list'];
export const Cards = __ns.subs['cards'].Provider;
export const CardsElement = __ns.subs['cards'].components['cards'];
export const CardsTableElement = __ns.subs['cards'].components['cardsTable'];
export const CardsChartElement = __ns.subs['cards'].components['cardsChart'];
export const WhopCardElement = __ns.subs['cards'].components['whopCard'];
export const CardTransactionsElement = __ns.subs['cards'].components['cardTransactions'];
