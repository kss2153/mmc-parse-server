
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



require("cloud/app.js");

var twilioAccountSid = 'AC9734d3a1a7dc7472d29f3e249a9e67af';
var twilioAuthToken = '4fac9f1426c6cd982967b032fe2023ec';
var twilioPhoneNumber = '+15208660313';
var secretPasswordToken = 'password17892783923';

var language = "en";
var languages = ["en", "es", "ja", "kr", "pt-BR"];

var twilio = require('twilio')(twilioAccountSid, twilioAuthToken);

Parse.Cloud.define("sendCode", function(req, res) {
	var phoneNumber = req.params.phoneNumber;
	phoneNumber = phoneNumber.replace(/\D/g, '');

	var lang = req.params.language;
  if(lang !== undefined && languages.indexOf(lang) != -1) {
		language = lang;
	}

	if (!phoneNumber || (phoneNumber.length != 10 && phoneNumber.length != 11)) return res.error('Invalid Parameters');
	Parse.Cloud.useMasterKey();
	var query = new Parse.Query(Parse.User);
	query.equalTo('username', phoneNumber + "");
	query.first().then(function(result) {
		var min = 1000; var max = 9999;
		var num = Math.floor(Math.random() * (max - min + 1)) + min;

		if (result) {
			result.setPassword(secretPasswordToken + num);
			result.set("language", language);
			result.save().then(function() {
				return sendCodeSms(phoneNumber, num, language);
			}).then(function() {
				res.success({});
			}, function(err) {
				res.error(err);
			});
		} else {
			var user = new Parse.User();
			user.setUsername(phoneNumber);
			user.setPassword(secretPasswordToken + num);
			user.set("language", language);
			user.setACL({});
			user.save().then(function(a) {
				return sendCodeSms(phoneNumber, num, language);
			}).then(function() {
				res.success({});
			}, function(err) {
				res.error(err);
			});
		}
	}, function (err) {
		res.error(err);
	});
});

Parse.Cloud.define("logIn", function(req, res) {
	Parse.Cloud.useMasterKey();

	var phoneNumber = req.params.phoneNumber;
	phoneNumber = phoneNumber.replace(/\D/g, '');

	if (phoneNumber && req.params.codeEntry) {
		Parse.User.logIn(phoneNumber, secretPasswordToken + req.params.codeEntry).then(function (user) {
			res.success(user.getSessionToken());
		}, function (err) {
			res.error(err);
		});
	} else {
		res.error('Invalid parameters.');
	}
});

function sendCodeSms(phoneNumber, code, language) {
	var prefix = "+1";
	if(typeof language !== undefined && language == "ja") {
		prefix = "+81";
	} else if (typeof language !== undefined && language == "kr") {
		prefix = "+82";
		phoneNumber = phoneNumber.substring(1);
	} else if (typeof language !== undefined && language == "pt-BR") {
		prefix = "+55";
  }

	var promise = new Parse.Promise();
	twilio.sendSms({
		to: prefix + phoneNumber.replace(/\D/g, ''),
		from: twilioPhoneNumber.replace(/\D/g, ''),
		body: 'Your login code for AnyPhone is ' + code
	}, function(err, responseData) {
		if (err) {
			console.log(err);
			promise.reject(err.message);
		} else {
			promise.resolve();
		}
	});
	return promise;
}
