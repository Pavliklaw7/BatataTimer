
document.addEventListener("DOMContentLoaded", async () => {

  const {
    getApiKey,
    activeEviit,
    apiKeyValue,
  } = config.keys;
  

  chrome.runtime.onMessage.addListener((message) => {
    switch (message) {
      case activeEviit:
        getPageHTML
        console.log(message);
        break;
    }
  });


  function getPageHTML() {
    chrome.tabs.query({active: true}, function(tabs) {
        var tab = tabs[0];
        console.log(tab);
        chrome.tabs.executeScript(tab.id, {
          code: 'document.querySelector("html").outerHTML'
        }, (res) => {
          console.log(res)
        });
    });
  }
});
