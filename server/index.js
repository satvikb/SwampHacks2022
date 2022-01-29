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
  //request.id
  var body = request.body;
  console.log("request body ", body.document.type, body.encodingType)

  var document = body.document;

  // Detects the sentiment of the text
  try{
    // const [result] = await client.analyzeSentiment({document: document});
    const [result] = await language.analyzeSyntax({document: document});

    const sentencesObject = result.sentences;
    
    var sentences = [];
    for (var i = 0; i < sentencesObject.length; i++) {
      var sentence = sentencesObject[i];
      var sentenceText = sentence.text.content;
      // TODO filter out sentences that are too short, etc
      sentences.push(sentenceText);
    }
    
    var target = "sr-Latn"
    let [translations] = await translate.translate(sentences, target);
    translations = Array.isArray(translations) ? translations : [translations];

 
    // console.log(`Text: ${text}`);
    // console.log(`Sentiment score: ${sentiment.score}`);
    // console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
    response.send(translations)
  }catch(err){
    console.log(err)
    response.send(err)
  }

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

