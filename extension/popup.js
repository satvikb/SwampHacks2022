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

//When on button is clicked, get HTML information from URL
function makeHttpObject() {
  if("XMLHttpRequest" in window)return new XMLHttpRequest();
	else if("ActiveXObject" in window)return new ActiveXObject("Msxml2.XMLHTTP");
}

var request = makeHttpObject();
request.open("GET", "/", true);
request.send(null);
request.onreadystatechange = function() {
  if (request.readyState == 4)
    console.log(request.responseText);
};