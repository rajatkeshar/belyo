'use strict';
const request = require('request');
module.exports = {
    call: async function(baseURL, method, url_path, payload, token, cb){
        return new Promise((resolve, reject) => {
            var options = {
                method: method,
                url: baseURL + ''+ url_path,
                headers:{
                  'Content-Type':'application/json',
                  'magic': '594fe0f3'
                },
                body: JSON.stringify(payload)
            };
            if(token) {
              options.headers['belrium-token'] = token
            }
            function callback(error, response, body) {
                if(error) return reject(error);
                try {
                   resolve(JSON.parse(body));
               } catch(e) {
                   reject(e);
               }
            }
            request(options, callback);
        });
    }
}
