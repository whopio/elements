import { createNamespaceReact } from './_runtime/react/namespace.js';
const __ns = createNamespaceReact(
  'payments',
  [
    { key: 'payment', events: ['onChange', 'onAddressChange'] },
    { key: 'address', events: ['onChange'] },
    { key: 'card', events: ['onChange'] },
    { key: 'email', events: ['onChange'] },
    { key: 'taxId', events: ['onChange'] },
  ],
  [],
  [
    {
      key: 'cardFields',
      events: ['onChange'],
      children: [
        { key: 'cardNumber', events: [] },
        { key: 'cardExpiry', events: [] },
        { key: 'cardCvc', events: [] },
      ],
    },
  ],
);
export const Payments = __ns.HandleProvider;
export const usePayments = __ns.useHandle;
export const PaymentElement = __ns.components['payment'];
export const AddressElement = __ns.components['address'];
export const CardElement = __ns.components['card'];
export const EmailElement = __ns.components['email'];
export const TaxIdElement = __ns.components['taxId'];
export const CardFields = __ns.subs['cardFields'].Provider;
export const CardNumberElement = __ns.subs['cardFields'].components['cardNumber'];
export const CardExpiryElement = __ns.subs['cardFields'].components['cardExpiry'];
export const CardCvcElement = __ns.subs['cardFields'].components['cardCvc'];
