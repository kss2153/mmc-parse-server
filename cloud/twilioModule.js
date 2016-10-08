/**
 * Twilio module test
 */
 
(function() {
 
  var url = '/2010-04-01/Accounts/';
  var accountSid = 'AC9734d3a1a7dc7472d29f3e249a9e67af';
  var authToken = '4fac9f1426c6cd982967b032fe2023ec';
 
  module.exports = {
    /**
     * Get the version of the module.
     * @return {String}
     */
    version: '1.0.0',
 
    /**
     * Initialize the Twilio module.
     */
    initialize: function() {
      return this;
    },
 
    /**
     */
    sendSMS: function(params, options) {
      return Parse.Cloud.httpRequest({
        method: 'POST',
        url: 'https://api.twilio.com/2010-04-01/Accounts/AC9734d3a1a7dc7472d29f3e249a9e67af/Messages',  
        headers: {
          'Authorization': 'Basic QUM5NzM0ZDNhMWE3ZGM3NDcyZDI5ZjNlMjQ5YTllNjdhZjo0ZmFjOWYxNDI2YzZjZDk4Mjk2N2IwMzJmZTIwMjNlYw0K',
          'Host': 'api.twilio.com',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params,
      }).then(function(httpResponse) {
        console.log(httpResponse.text);
      }, function(httpResponse) {
        console.error('Request failed with response code ' + httpResponse.status);
      });
    }
 
  }
}());
