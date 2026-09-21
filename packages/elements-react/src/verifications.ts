import { createNamespaceReact } from './_runtime/react/namespace.js';
const __ns = createNamespaceReact(
  'verifications',
  [
    { key: 'kyc', events: ['onStatusChanged', 'onCompleted', 'onActionRequired', 'onLoadFailed'] },
    { key: 'capabilities', events: ['onVerificationRequested'] },
    { key: 'rfi', events: ['onSubmitted', 'onCompleted', 'onLoadFailed'] },
  ],
  [],
  [],
);
export const Verifications = __ns.HandleProvider;
export const useVerifications = __ns.useHandle;
export const KycElement = __ns.components['kyc'];
export const CapabilitiesElement = __ns.components['capabilities'];
export const RfiElement = __ns.components['rfi'];
