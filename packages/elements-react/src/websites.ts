import { createNamespaceReact } from './_runtime/react/namespace.js';
const __ns = createNamespaceReact(
  'websites',
  [
    {
      key: 'websites',
      events: ['onWebsiteToggled', 'onWebsitesLoaded', 'onVerifyRequested', 'onSettingsRequested', 'onEditRequested'],
    },
    { key: 'pixel-setup', events: ['onRedirectUrlChanged', 'onScanned', 'onFinished', 'onEventVerified'] },
  ],
  [],
  [],
);
export const Websites = __ns.HandleProvider;
export const useWebsites = __ns.useHandle;
export const WebsitesElement = __ns.components['websites'];
export const PixelSetupElement = __ns.components['pixel-setup'];
