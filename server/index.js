const express = require('express')
var bodyParser = require('body-parser')

const app = express()
const port = 8000
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();
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
    const [result] = await client.analyzeSyntax({document: document});

    const sentiment = result.sentences;
  
    
    // console.log(`Text: ${text}`);
    // console.log(`Sentiment score: ${sentiment.score}`);
    // console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
    response.send(sentiment)
  }catch(err){
    console.log(err)
    response.send(err)
  }

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

