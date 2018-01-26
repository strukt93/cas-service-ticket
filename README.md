# cas-service-ticket
A Node module that creates/checks CAS service tickets.
This module allows you to generate CAS service tickets. It also allows you to check whether a CAS
service ticket is valid or not.

# Installation
`$ npm install cas-service-ticket`

# Sample Usage
```
var st = require("cas-service-ticket");

st.generateST("https://cas.apiit.edu.my/cas", "http://localhost", "TGT-715-chphC0bu7UbBcqayeOJvpE6LJyjE1zgjJXCrzYO3Kp5aOtGEcq-cas",
function(tgtStatus, tgtMsg){
    if(tgtStatus){
        st.validateST("https://cas.apiit.edu.my/cas", "http://localhost", tgtMsg,
            function(stStatus, stMessage){
                console.log(stStatus);
                console.log(stMessage);
    });}else{
        console.log(tgtStatus);
        console.log(tgtMsg);
    }
});
```

# Function Explanation
The `generateST()` function takes the CAS URL, service URL, CAS Ticket Granting Tickets, as well as a callback function as input
and calls the callback function with either the tuple `(true, ST)`, where ST is the generated CAS Service Ticket,
or `(false, message)` otherwise, with a message containing the response code from returned in the server response as the second value.
This function does not check the validity of the supplied Ticket Granting Tickets before attempting to generate a Service Ticket. Check https://www.npmjs.com/package/cas-tgt-checker for a module that performs these checks.

The `validateST()` function takes the CAS URL, service URL, Service Ticket, and callback function as input and calls the callback
function with either `(bool, JSON)`, where bool reflects the validity of the supplied Service Ticket with either `true` or `false`,
or (false, message)` otherwise, with a message containing the response code from returned in the server response as the second value.

