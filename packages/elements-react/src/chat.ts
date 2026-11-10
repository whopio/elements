import { createNamespaceReact } from './_runtime/react/namespace.js';
const __ns = createNamespaceReact(
  'chat',
  [
    {
      key: 'chat',
      events: [
        'onMessageSent',
        'onMessageDeleted',
        'onProfileClick',
        'onLinkClick',
        'onExperienceMentionClick',
        'onAttachmentClick',
      ],
    },
    { key: 'channelList', events: [] },
    { key: 'search', events: ['onResultClick'] },
  ],
  ['onChannelChange'],
  [],
);
export const Chat = __ns.HandleProvider;
export const useChat = __ns.useHandle;
export const ChatElement = __ns.components['chat'];
export const ChannelListElement = __ns.components['channelList'];
export const SearchElement = __ns.components['search'];
