
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();
const fs = require("fs");
const player = require('play-sound')();
const mysql = require("./mysql.js").connect;

const tstReq = (text, speed, pitch, file) => {

    const request = {
        audioConfig: {
            speakingRate: speed,
            pitch: pitch,
            audioEncoding: 'MP3'
        },
        input: {text: text},
        voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},};

    client.synthesizeSpeech(request, (err, response) => {
        if(err) throw err;

        mysql.query("insert into ?? (music) values ?", ["listening_beginner", response.audioContent], (err) => {if(err) throw err;});
        fs.writeFile(file, response.audioContent, 'binary', err => {});
        player.play(file, err => {if(err) throw err;});
    });
};

module.exports = tstReq;
