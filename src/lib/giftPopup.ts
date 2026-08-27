export const GIFT_POPUP_OPEN_EVENT = 'gift-popup:open';

export const openGiftPopup = () => {
  window.dispatchEvent(new CustomEvent(GIFT_POPUP_OPEN_EVENT));
};
