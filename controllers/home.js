var express    = require('express');
var request = require('request');
var controller = express.Router();

controller.route('/')
.get(function (req, res) {
  res.send('DNB Proxy');
});

controller.route('/dnbproxy')
  .get(function (req, res) {
    var product = req.query.product;
    var duns = req.query.duns;
    var authoptions = {
      url: 'https://maxcvservices.dnb.com/rest/Authentication',
      headers: {
          'x-dnb-user': 'P2000007E4C365358D14B49B9C2EB00D',
          'x-dnb-pwd' : '33lizards'
      }
    }
    var calloptions = {
      url : 'https://maxcvservices.dnb.com/V4.0/organizations/'+duns+'/products/'+product,
      headers : {
        authorization : ''
      }
    }

    dnbapiauth(authoptions, function(err, token) {
      if (err) return console.log(err);
      calloptions.headers.authorization = token;
      dnbapicall(calloptions, function(err, body) {
        if (err) return console.log(err);
        //console.log(body);
        res.send(body);
      });
    });
    //console.log(calloptions);
    //console.log(authoptions);


    function dnbapiauth(authoptions, callback){
      var auth = request.post(authoptions, function(err,response,body) {
        if (err) return callback(err);
        token = response.headers.authorization;
        callback(null, token)
      });
    }

    function dnbapicall(calloptions, callback){
      var call = request.get(calloptions, function(err,response,body) {
        if (err) return callback(err);
        callback(null,body);
      });
    }
  });

module.exports = ['/', controller];
