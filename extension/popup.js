const SERVER_URL = "http://localhost:8000";

// Initialize button with user's preferred color
let startTranslationButton = document.getElementById("startTranslationButton");

// difficulty button variables
var easyButton = document.getElementById("easyDifficultyButton");
var mediumButton = document.getElementById("mediumDifficultyButton");
var hardButton = document.getElementById("hardDifficultyButton");

// 0 - easy
// 1 - medium
// 2 - hard
var currentDifficulty = 0;
var numReplaceDictionary = {
  0: 3,
  1: 8,
  2: 15
}

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
  return document.body.innerText;
}

function getLocalHTML(completion){
  runFunctionWithCurrentTab(function(currTab){
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

function setTranslateArguments(sentences, numReplace){
  window.translearnNumReplace = numReplace;
  window.translearnSentences = sentences;
  console.log("set arguments ", sentences.length, numReplace);
}

function doTranslate(sentences){
  var numReplace = numReplaceDictionary[currentDifficulty];

  runFunctionWithCurrentTab(function(currTab){
    chrome.scripting.executeScript({
      func: setTranslateArguments,
      target: {tabId: currTab.id},
      args: [sentences, numReplace]
    }, (ir) => {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        console.log("Error injecting:"+chrome.runtime.lastError.message);
      }else{
        
        console.log("starting replacement")
        chrome.scripting.executeScript({
          files: ["pageReplacement.js"],
          target: {tabId: currTab.id}
        }, (injectionResults) => {
          // If you try and inject into an extensions page or the webstore/NTP you'll get an error
          if (chrome.runtime.lastError) {
            console.log("Error injecting:"+chrome.runtime.lastError.message);
          }else{
            console.log("finish translate inject")
          }
        });


      }
    });

    
  });
}

function runFunctionWithCurrentTab(callback){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var currTab = tabs[0];
    if (currTab) { // Sanity check
      callback(currTab);
    }
  });
}

function beginTranslation(){
  // get local HTML code
  getLocalHTML(function(html){
    // get sentences translated from google
    getSentences(html, function(sentences){
      console.log("Got sentences ", sentences)
      // replace sentences with translated code
      doTranslate(JSON.parse(sentences));
    });
  })
}

startTranslationButton.addEventListener('click', event => {
  console.log("click")
  beginTranslation();
});

// difficulty button listeners
easyButton.addEventListener('click', event => {
  console.log("easy")
  currentDifficulty = 0;
});

// medium
mediumButton.addEventListener('click', event => {
  console.log("medium")
  currentDifficulty = 1;
});

// hard
hardButton.addEventListener('click', event => {
  console.log("hard")
  currentDifficulty = 2;
});
