const {
  apiKey,
  goToLinkedin,
  goToXing,
  activeEviit,
  isOnTargetPage,
  getApiKey,
  activeEviitGenerate,
  displayIntro,
} = config.keys;

const {
  targetLinks,
  linkedinUrl,
  xingUrl,
} = config.values;


chrome.runtime.onMessage.addListener(async function (message) {
  switch (message.context) {
    case goToLinkedin:
      chrome.tabs.create(
        { url: linkedinUrl },
        async (tab) => {
          isOnTargetPageFunc();
          console.log(tab.title);
        },
      );
      break;
    case goToXing:
    chrome.tabs.create(
      { url: xingUrl },
      async (tab) => {
        isOnTargetPageFunc();
        console.log(tab.title);
      },
    );
      break;
    case isOnTargetPage:
      isOnTargetPageFunc();
      break;
    case getApiKey:
      getApiKeyFunc();
  }
});


function isOnTargetPageFunc() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    const url = tabs[0].url;

    const isOnTargetLink = targetLinks.some((link) => url.includes(link));

    console.log('isOnTargetLink', isOnTargetLink);

    if (isOnTargetLink) {
      chrome.runtime.sendMessage({
        message: activeEviit
      });
    getPageHTML();
    } else {
      chrome.runtime.sendMessage({
        message: displayIntro
      });
    }
  });
}

async function getApiKeyFunc() {
  const apiKey = await storageGet(apiKeyValue);

  if (apiKey) {
    chrome.runtime.sendMessage({
      message: activeEviitGenerate
    });
  }
}

function getPageHTML() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      console.log(tab);
      chrome.tabs.executeScript(tab.id, {
        code: 'document.querySelector("html").outerHTML'
      }, (res) => {
        console.log(res)
      });
  });
}
