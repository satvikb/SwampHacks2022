const express = require('express')
var bodyParser = require('body-parser')

const app = express()
const port = 8000
const Language = require('@google-cloud/language');
const {Translate} = require('@google-cloud/translate').v2;

const language = new Language.LanguageServiceClient();
const translate = new Translate();

var jsonParser = bodyParser.json()

app.use(bodyParser.json({limit: "50mb"}));

app.post('/getSentences', jsonParser, async function(request,response){
  var body = request.body;
  console.log("request body ", body.document.type, body.encodingType)

  var languageCode = body.languageCode;
  var document = body.document;
  try{
    const [result] = await language.analyzeSyntax({document: document});

    const sentencesObject = result.sentences;
    
    var sentences = [];
    for (var i = 0; i < sentencesObject.length; i++) {
      var sentence = sentencesObject[i];
      var sentenceText = sentence.text.content;
      // TODO filter out sentences that are too short, etc
      // only add if there are more than 5 words
      
      // only add if there are less than 128 sentences already
      if (sentences.length > 127){
        break;
      }

      if (sentenceText.split(" ").length > 4){
        sentences.push(sentenceText);
      }
    }
    
    let [translations] = await translate.translate(sentences, languageCode);
    translations = Array.isArray(translations) ? translations : [translations];

    // create an object that pairs the original sentence with the translated sentence
    var sentencePairs = [];
    for (var i = 0; i < translations.length; i++) {
      var sentencePair = {};
      sentencePair.original = sentences[i];
      sentencePair.translated = translations[i];
      sentencePairs.push(sentencePair);
    }
    response.send(sentencePairs)
  }catch(err){
    response.send(err)
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

