export const PSC_OPEN_CHAT_EVENT = 'psc-nepal:open-chat';

export interface OpenChatDetail {
  prompt?: string;
}

export function openPscChat(prompt?: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<OpenChatDetail>(PSC_OPEN_CHAT_EVENT, {
      detail: { prompt },
    })
  );
}
