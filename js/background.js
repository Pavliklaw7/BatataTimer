chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_BADGE') {
    chrome.action.setBadgeText({ text: message.text });
    chrome.action.setBadgeBackgroundColor({ color: '#FF6347' }); // помаранчевий
  }
});
