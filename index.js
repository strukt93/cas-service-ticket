const request = require('request');

function validateParams(casURL, ticket, callback){
    if(typeof callback !== 'function' || !callback){
        var err = new Error("Invalid or no callback function supplied");
        console.log(err.stack);
        return false;
    }

    if(!ticket || ticket.length == 0){
        var err = new Error("No or empty ticket value supplied");
        console.log(err.stack);
        return false;
    }
    return validateURL(casURL);
}

function validateURL(casURL, callback){
    var message = "Invalid URL supplied: Check the following examples for reference:\n";
    var examples = "https://example.com/cas\nhttp://www.example.com/cas\nhttp://192.168.0.10:80/path/to/cas\n";
    var pattern = new RegExp('^(https?:\/\/)'+ // protocol
    '((([a-z0-9]([a-z0-9-]*[a-z0-9])*)\.)+[a-z]{2,}|'+ // domain name
    '(([0-9]{1,3}\.){3}[0-9]{1,3}))'+ // OR ip (v4) address
    '(\:[0-9]+)?(\/[-a-z[0-9]%_.~+]*)*');
    if(!pattern.test(casURL))
        return callback(false, Error(message + examples));
    return true;
}

exports.generateST = function(casURL, serviceURL, tgt, callback){
    validateParams(casURL, tgt, callback);
    var url = casURL + '/v1/tickets/' + tgt;
    var form = {"service": serviceURL};
    request.post({url: url, form: form}, (error, response, body) => {
        if(error){
            return callback(false, error);
        }
        switch(response.statusCode){
            case 200: return callback(true, body);
            default: return callback(false, "Error: Server returned a " + response.statusCode + " response with the following body:\n" + response.body);
        }
    });
}

exports.validateST = function(casURL, serviceURL, serviceTicket, callback){
    validateParams(casURL, serviceTicket, callback);
    var url = casURL + '/serviceValidate?format=json&ticket=' + serviceTicket + "&service=" + serviceURL;
    request(url, (error, response, body) => {
        if(error){
            return callback(false, error);
        }
        if(response.headers['content-type'].startsWith('application/json')){
            var body = JSON.parse(response.body);
            if(body['serviceResponse']['authenticationFailure'])
                return callback(false, response.body);
            return callback(true, response.body);
        }else{
            return callback(false, "Error: Server returned a " + response.statusCode + " response with the following body:\n" + response.body);
        }
    });
}