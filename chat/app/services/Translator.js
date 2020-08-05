const { request } = require('http');

module.exports = function(sourceText, sourceLang, targetLang) {
    return new Promise(function(resolve, reject) {
        let encodedSourceText = encodeURI(sourceText);

        const OPTIONS = {
            host: 'localhost',
            port: 8010,
            path: `/translate?st=${ encodedSourceText }&sl=${ sourceLang }&tl=${ targetLang }`,
            method: 'get',
            headers: {
                'Accept' : 'application/json'
            }
        };

        const req = request(OPTIONS, function(res) {
            let buffer = [];

            res.on('data', function(chunk) {
                buffer.push(chunk);
            });

            res.on('end', function() {
                let data = Buffer.concat(buffer).toString();   
                let jsonData = JSON.parse(data);

                if (res.statusCode == 200) {
                    resolve(jsonData);
                } else {
                    reject(jsonData);
                }
            });
        });

        req.end();
    });
};