class ExtensionMessage{
    constructor(context, data){
        this.context = context;
        this.data = data;
    }
};


//To Save Data From storage
function storageSet({key, value}){
    return new Promise((resolve) => {
        chrome.storage.sync.set({[key]: value}, function() {
            resolve();
          });
    });
}

//To Read Data From Storage
function storageGet(key){

    return new Promise((resolve) => {
        chrome.storage.sync.get([key], function(result) {
            resolve(result[key]);
            });
    });

  
    
}

function loading(active){
    let overlay = document.querySelector("div#loadingOverlay");
    if(overlay){
        overlay.style.display = active ? "block" : "none";
    }
    
}

const sleep = m => new Promise(r => setTimeout(r, m))


function sendPageMessage(data, specificID = null){
    return new Promise((resolve) =>{
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            if(tabs && tabs.length){
                tabID =tabs[0].id;
                chrome.tabs.sendMessage(specificID || tabID, data);
                console.log(data);
                resolve();
            }
        });
    });
}

function forSeconds(seconds){

    return new Promise((resolve) =>{setTimeout(function(){resolve()}, seconds * 1000)});
}



function activateContextMenu(menuId, activate){

    chrome.contextMenus.update(menuId, {
        visible: activate ? true : false,
  });
}




function floor(value, decimals = 0){
    return Math.floor(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function contentSlideInit(){
    let content = document.querySelector("#content");
    let slides = document.querySelectorAll("nav .nav-item");
    slides.forEach(function(el, index){
        el.onclick = function(){
            if(!el.classList.contains("active")){
                let active = el.closest("nav").querySelector(".active");
                active.classList.remove("active");

                active.querySelector("img").src = `./images/${active.querySelector("img").dataset["name"]}.svg`;

                el.classList.add("active");
                el.querySelector("img").src = `./images/${el.querySelector("img").dataset["name"]}-active.svg`;
                content.style.transform = `translateX(-${index * 100/ slides.length}%)`;
            }
            
        }
        
    });
}

function elementAppear(selector, cyclesCount){
    var cycles = cyclesCount || 0;
    console.log(selector);
    return new Promise((resolve) => {
        let id = setInterval(function(){
            cycles++;
            let element = document.querySelector(selector);

            if(element){
                clearInterval(id);
                resolve(element);
            }
        }, 100);
    });
}

function requestBackground(request){
    // request is {context, data}
    return new Promise((resolve) => {
        var handler = ({context, data}) => {
          if(context == request.context){
            chrome.runtime.onMessage.removeListener(handler);
            resolve(data);
          }
        };
        chrome.runtime.onMessage.addListener(handler);
          chrome.runtime.sendMessage(request);
      });
}

function copyToClipboard(text){
    const input = document.createElement("input");
    input.style.opacity = 0;
    document.body.appendChild(input);
    input.value = text;
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
}

function getActiveUrl(){
    return new Promise((resolve) =>{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            console.log(activeTab);
            var url = new URL(activeTab.url);

            resolve(url.host.replace(/^www\./,''));
       
         });
    });
}