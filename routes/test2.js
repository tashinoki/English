
const express = require('express');
const routes = express.Router();
const fs = require('fs');
const player = require('play-sound')();
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();
const text = "AJAX is the art of exchanging data with a server, and update parts of a web page - without reloading the whole page.";


routes.get('/music', (req, res) => {
    const {id, speed, pitch} = req.query;
    const file_name = 'output' + id + '&speed=' + speed + '&pitch=' + pitch + '.mp3';

    fs.stat(file_name, (error, status) => {

        if(error){
            const request = {
                audioConfig: {
                    pitch: pitch,
                    speakingRate: speed,
                    audioEncoding: 'MP3'
                },
                input: {text: text},
                voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
            };

            client.synthesizeSpeech(request, (err, response) => {
                if(err) throw err;

                fs.writeFile('Sound/' + file_name, response.audioContent, 'binary', err => {
                    console.log('here');
                    console.log('res', err);
                });

                player.play('Sound/' + file_name, err => {
                    if(err) throw err;
                    res.end();
                });
            });
        }

        else {
            player.play('Sound/' + file_name, err => {
                if (err) throw err;
                res.end();
            });
        }
    });
});


module.exports = routes;
