// background.js

let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

// try{
//   self.importScripts("js/gapi.js");
// }catch(err){
//   console.log(err)
// }