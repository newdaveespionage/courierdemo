import fetch from "node-fetch";

import * as dotenv from "dotenv";
dotenv.config();

async function send_secret_message() {
    const morse_options = {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    };

    const original_message =
        encodeURI('hi, I made it through');
    const morse_endpoint =
        "https://api.funtranslations.com/translate/morse.json?text=" +
        original_message;

    const morse_response = await fetch(morse_endpoint, morse_options);
    const translation = await morse_response.json();
    const message = translation.contents.translated;

    const courier_options = {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.APIKEY,
        },
        body: JSON.stringify({
        message: {
            to: {
            email: process.env.EMAIL,
            phone_number: process.env.PHONENUMBER,
            },
            content: {
            title: "new secret message",
            body: message,
            },
            routing: {
            method: "all",
            channels: ["sms", "email"],
            },
        },
        }),
    };

  fetch("https://api.courier.com/send", courier_options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}

send_secret_message();