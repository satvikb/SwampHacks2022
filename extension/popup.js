const SERVER_URL = "http://localhost:8000";

// Initialize button with user's preferred color
let startTranslationButton = document.getElementById("startTranslationButton");

//Create HTTP object that will store the HTML code
function makeHttpObject() {
  if("XMLHttpRequest" in window)return new XMLHttpRequest();
	else if("ActiveXObject" in window)return new ActiveXObject("Msxml2.XMLHTTP");
}

//Get sentences from Syntactic Analysis
function getSentences(HTML, completion) {
  // Prepares a document, representing the provided text
  const document = {
    content: HTML,
    type: 'PLAIN_TEXT',
  };

  //Specify website type
  const encodingType = 'UTF8';

  // create request object
  var requestObj = {
    encodingType: encodingType,
    document: document
  }

  // console.log("Sending request to server ", requestObj);

  // send a request to localhost:8000/getSentences
  sendRequest(SERVER_URL+"/getSentences", "POST", function(responseText){
    completion(responseText);
  }, requestObj);
}

function getSource(){
  console.log(document.body.innerText)
  // return document.documentElement.outerHTML;
  return document.body.innerText;
}

function getLocalHTML(completion){

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var currTab = tabs[0];
    if (currTab) { // Sanity check
      chrome.scripting.executeScript({
        func: getSource,
        target: {tabId: currTab.id}
      }, (injectionResults) => {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
          console.log("Error injecting:"+chrome.runtime.lastError.message);
        }else{
          var frameResult = injectionResults[0];
          var resultText = frameResult.result;
          completion(resultText);
        }
      });
    }
  });
}

function sendRequest(url, method, completion, body){
  var request = makeHttpObject();
  request.open(method, url, true);


  request.onreadystatechange = function() {
    if (request.readyState == 4){
      var response = request.responseText;
      completion(response);
    }
  };

  // check if method is POST, if so, send the body
  if(method == "POST"){
    // console.log("sending post ", JSON.stringify(body));
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(body));
  }else{
    request.send(null);
  }
}

function beginTranslation(){
  // get local HTML code
  getLocalHTML(function(html){
    // get sentences from google
    getSentences(html, function(sentences){
      // translate using google
      console.log("Got sentences ", sentences)
      // replace sentences with translated code
    });

  })

}

//Bind button to correct button ID
const button = document.querySelector('#startTranslationButton');

button.addEventListener('click', event => {
  console.log("click")
  beginTranslation();
});

// chrome.runtime.onMessage.addListener(function(request, sender) {
//   if (request.action == "getSource") {
//     receivedPageSource(request.source);
//   }
// });

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   var currTab = tabs[0];
//   if (currTab) { 
//     console.log("injecting")
//     chrome.scripting.executeScript({
//       files: ["pageSource.js"],
//       target: {tabId: currTab.id}
//     }, function() {
//       // If you try and inject into an extensions page or the webstore/NTP you'll get an error
//       console.log("Injected")
//       if (chrome.runtime.lastError) {
//         console.log("Error injecting:"+chrome.runtime.lastError.message);
//       }
//     });
//   }
// });

const languages = {"English": "en", "Chinese (Simplified)": "zh", "Spanish": "es", "German": "de", "French": "fr", "Hindi": "hi", "Arabic": "ar", "Russian": "ru", "Japanese": "ja", "Dutch": "nl"}
var list = document.getElementById("languages")
for (const [key, value] of Object.entries(languages)) {
  var anchor = document.createElement("a");
  anchor.href = "#";
  anchor.innerText = key;

  var elem = document.createElement("li");
  elem.appendChild(anchor);
  list.appendChild(elem);
}