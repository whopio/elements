import { createNamespaceReact } from './_runtime/react/namespace.js';
const __ns = createNamespaceReact(
  'checkout',
  [
    { key: 'checkout', events: [] },
    { key: 'expressCheckout', events: [] },
  ],
  ['onComplete'],
  [],
);
export const Checkout = __ns.HandleProvider;
export const useCheckout = __ns.useHandle;
export const CheckoutElement = __ns.components['checkout'];
export const ExpressCheckoutElement = __ns.components['expressCheckout'];
