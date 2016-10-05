
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});



var client = require('./myMailModule-1.0.0.js');
client.initialize('car-loop.com', 'key-d481e42781c2820e2c6296f7827fabb8');

Parse.Cloud.define("sendEmailToUser", function(request, response) {
  client.sendEmail({
    to: request.params.to,
    from: "no-reply@car-loop.com",
    subject: "Welcome to CarLoop",
    text: request.params.text
  }).then(function(httpResponse) {
    response.success("Email sent!");
  }, function(httpResponse) {
    console.error(httpResponse);
    response.error("Uh oh, something went wrong");
  });
});


var twilio = require('./twilioModule.js');
twilio.initialize();

Parse.Cloud.define("sendSMSToUser", function(request, response) {
  twilio.sendSMS({
    To: request.params.to,
    From: '+15208660313',
    Body: request.params.body
  }).then(function(httpResponse) {
    response.success("SMS sent!");
  }, function(httpResponse) {
    console.error(httpResponse);
    response.error("Uh oh, something went wrong");
  });
});
