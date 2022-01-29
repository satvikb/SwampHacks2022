// Initialize button with user's preferred color
let startTranslationButton = document.getElementById("startTranslationButton");

chrome.storage.sync.get("color", ({ color }) => {
  startTranslationButton.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
startTranslationButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    console.log()
    document.body.style.backgroundColor = color;
  });
}

//Create HTTP object that will store the HTML code
function makeHttpObject() {
  if("XMLHttpRequest" in window)return new XMLHttpRequest();
	else if("ActiveXObject" in window)return new ActiveXObject("Msxml2.XMLHTTP");
}

//Get sentences from Syntactic Analysis
function getSentences(HMTL, completion) {
  // Prepares a document, representing the provided text
  const document = {
    content: HTML,
    type: 'HTML',
  };

  //Specify website type
  const encodingType = 'UTF8';

  // create request object
  var requestObj = {
    document: document,
    encodingType: encodingType,
  }

  gapi.client.request({
    // API endpoint name for syntactic analysis
    'path': 'https://googleapis.com/...',
  }).execute(function(){
    completion(sentences);
  })
}

function getLocalHTML(completion){
  //On click, create an object 
  var request = makeHttpObject();

  //Fetch the source code and and store in request
  request.open("GET", "/", true);
  request.send(null);
  request.onreadystatechange = function() {
    if (request.readyState == 4){
      var html = request.responseText;
      completion(html);
    }

  };
}

function beginTranslation(){
  // get local HTML code
  getLocalHTML(function(html){
    // get sentences from google
    getSentences(html, function(sentences){
      // translate using google

      // replace sentences with translated code
    });

  })

}

//Bind button to correct button ID
const button = document.querySelector('startTranslationButton');

button.addEventListener('click', event => {
  beginTranslation();
});