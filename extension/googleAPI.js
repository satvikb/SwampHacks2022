function start() {
  // 2. Initialize the JavaScript client library.
  gapi.client.init({
    'apiKey': 'AIzaSyCDkaPpTcIp8KoZ4UAd5q2gu24ri4NSUWc',
    // clientId and scope are optional if auth is not required.
    'clientId': '624451611256-f5hf3a4eirqhh38tuv13fp6o2p3uei3t.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/cloud-language',
  }).then(function() {

  }, function(reason) {
    console.log('Error: ' + reason.result.error.message);
  });
};
// 1. Load the JavaScript client library.
gapi.load('client', start);