
const express = require("express");
const routes = express.Router();
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();
const fs = require('fs');

routes.get('/', (req, res, next) => {

    const text = "AJAX is the art of exchanging data with a server, and update parts of a web page - without reloading the whole page.";
    const request = {
        audioConfig: {
            pitch: 0.00,
            speakingRate: 4.00,
            audioEncoding: 'MP3'
        },
        input: {text: text},
        voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    };

    client.synthesizeSpeech(request, (err, response) => {
        if(err) throw err;

        fs.writeFile('Sound/output1.mp3', response.audioContent, 'binary', err => {
            console.log('res', err);
        });

        console.log("success");
    });

    res.render('test');
});

module.exports = routes;
