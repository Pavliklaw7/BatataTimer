const {
  goToLinkedin,
  goToXing,
  activeEviit,
  apiKeyValue,
  getApiKey,
  isOnTargetPage,
  active,
  activeEviitGenerate,
  displayIntro,
} = config.keys;


init();

async function init() {

  /* global Variables */

  let apiRequest;
  let genCount = 1;

  const linkedinLink = document.querySelector('#linkedinLink');
  const xingLink = document.querySelector('#xingLink');
  const readyBtn = document.querySelector('.form__btn');
  const introPopup = document.querySelector('#intro');
  const enterApiForm = document.querySelector('#enterApiForm');
  const generateBtn = document.querySelector('#generateBtn');
  const generateForm = document.querySelector('#generateForm');
  const loadingResult = document.querySelector('#loadingResult');
  const apiKeyInput = document.querySelector('.form__input');
  const apiKeyInputValue = apiKeyInput.value;

  console.log(apiKeyInputValue);
  const generateCancelBtn = document.querySelector('#generateCancelBtn');
  const copyGeneratedTextBtn = document.querySelector('#copyGeneratedTextBtn');
  const generatedText = document.querySelector('#generatedText');
  const generateResult = document.querySelector('#generateResult');
  const generateNewBtn = document.querySelector('#generateNewBtn');


  /* Init Functions */

  checkApiKey();

  /* Message Passing */

  chrome.runtime.onMessage.addListener((request) => {
    switch (request.message) {
      case activeEviit:
        switchToJobDescrInput();
        break;
      case activeEviitGenerate:
        checkApiKey();
        break;
      case displayIntro:
        displayIntroFunc();
        break;
    }
  });

  function openLinkedin() {
    requestBackground(new ExtensionMessage(goToLinkedin));
  }

  function openXing() {
    requestBackground(new ExtensionMessage(goToXing));
  }

  linkedinLink.addEventListener('click', () => openLinkedin());
  xingLink.addEventListener('click', () => openXing());
  readyBtn.addEventListener('click', (e) => submitApiKey(e))
  generateBtn.addEventListener('click', (e) => generateText(e));
  copyGeneratedTextBtn.addEventListener('click', () => copy());
  generateNewBtn.addEventListener('click', (e) => generateNewText(e));

  async function switchToJobDescrInput() {
     enterApiForm.classList.remove(active);
     generateForm.classList.add(active);
  }

  function displayIntroFunc() {
    introPopup.classList.add(active);
  }

  async function checkApiKey(key) {
    const apiKey = await storageGet(apiKeyValue);

    console.log(apiKey);

    if (apiKey === 'test' || key !== undefined) {
      enterApiForm.classList.remove(active);
      await requestBackground(new ExtensionMessage(isOnTargetPage));
    } else {
      simpleNotify.notify("Api key is incorrect", "danger", 3000);
      enterApiForm.classList.add(active);
    }
  };

  function generateText(e) {
    e.preventDefault();

    const jobDescrValue = document.querySelector('#jobDescr').value;
    const jobDescrLoader = document.querySelector('#jobDescrLoader');

    jobDescrLoader.value = jobDescrValue;

    generateForm.classList.remove(active);
    generateResult.classList.remove(active);
    loadingResult.classList.add(active);

    apiRequest = setTimeout(() => {
      getGeneratedText();
    }, 5000) 

    generateCancelBtn.addEventListener('click', () => {

      clearTimeout(apiRequest)

      generateForm.classList.add(active);
      loadingResult.classList.remove(active);      
    });
  }


  function copy() {
    const  copyText = document.querySelector("#generatedText");
    copyText.select();
    document.execCommand("copy");
    copyText.blur();
    simpleNotify.notify("copied!", "attention", 2000);
  }

  function getGeneratedText() {
    generatedText.value = `Test String ${genCount}`;
    genCount++;
    loadingResult.classList.remove(active);
    generateResult.classList.add(active);
  }


  function generateNewText(e) {
    generateText(e);
  }

  async function submitApiKey(e) {
    e.preventDefault();

    await storageSet({key: apiKeyValue, value: apiKeyInputValue});

    checkApiKey(apiKeyInputValue);
    apiKeyInput.value = '';
  }
}
