function handlePageTranslation(sentences, numReplace){
  console.log("handling replacement ", sentences, numReplace)
  // handle the translation of the page
  // pick random number of sentences based on difficulty
  const shuffled = sentences.sort(() => 0.5 - Math.random());

  // Get sub-array of first n elements after shuffled
  let selected = shuffled.slice(0, numReplace);

  // loop selected
  var currentPage = document.body.innerHTML;
  for (var i = 0; i < selected.length; i++) {
    // call replace
    var original = selected[i].original;
    var translated = selected[i].translated;

    var translatedWithSpoiler = translated + "<span class='translearnspoiler2'>Original: " + original + "</span>";
    console.log("replacing ", original, " with ", translated)
    var re = new RegExp(original,"g");
    currentPage = currentPage.replace(re, translatedWithSpoiler);
    // console.log("equal: ", newReplace == currentPage)

    // currentPage = replaceTextOnPage(currentPage, selected[i].original, selected[i].translated);
  }
  document.body.innerHTML = currentPage;
  console.log("Updated page with new sentences ", currentPage)
}

function replaceTextOnPage(currentPage, original, translated){
  // replace the text on the page by finding the original and replaceing it with translated
  console.log("replacing ", original, " with ", translated)
  var replace = original.trim()+"\\d";
  var re = new RegExp(replace,"g");
  return currentPage.replace(re, translated);
}

console.log("INJETCTION", window.translearnSentences, window.translearnNumReplace) 
handlePageTranslation(window.translearnSentences, window.translearnNumReplace);