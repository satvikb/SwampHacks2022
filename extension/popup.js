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

//Prepare docuement for Syntactic Analysis
function makeDocument(HMTL) {
  // Imports the Google Cloud client library
  //const language = require('@google-cloud/language');
  // Creates a client
  //const client = new language.LanguageServiceClient();
  //Set text = raw HTML
  const text = HMTL;

  // Prepares a document, representing the provided text
  const document = {
    content: text,
    type: 'HTML',
  };

  //Specify website type
  const encodingType = 'UTF8';

  // Detects the sentiment of the document
  const [syntax] = await client.analyzeSyntax({document, encodingType});

  console.log('Tokens:');
  syntax.tokens.forEach(part => {
    console.log(`${part.partOfSpeech.tag}: ${part.text.content}`);
    console.log('Morphology:', part.partOfSpeech);
  });
}

//Bind button to correct button ID
const button = document.querySelector('startTranslationButton');

button.addEventListener('click', event => {

  //On click, create an object 
  var request = makeHttpObject();

  //Fetch the source code and and store in request
  request.open("GET", "/", true);
  request.send(null);
  request.onreadystatechange = function() {
    if (request.readyState == 4)
      console.log(request.responseText);
  };


});