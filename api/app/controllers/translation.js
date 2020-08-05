const translate = require('@vitalets/google-translate-api');

module.exports.translate = function(application, req, res) {
    let sourceText =  decodeURI(req.query.st);
    let sourceLang = req.query.sl;
    let targetLang = req.query.tl;

    const promise = translate(
        sourceText, 
        { 
            client: 'gtx', 
            from: sourceLang, 
            to: targetLang 
        }
    );

    let jsonResponse = null;


    promise.then(function(response) {
        jsonResponse = {
            success: true,
            data: response
        };

        res.status(200).json(jsonResponse);
    }).catch(function(err) {
        jsonResponse = {
            success: false,
            errors: [
                err
            ]
        };

        res.status(400).json(jsonResponse);
    });
};