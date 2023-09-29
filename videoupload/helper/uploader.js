const assert = require("assert");
const fs = require("fs");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const readline = require("readline");

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];
const TOKEN_PATH = "./client_oauth_token.json";

const videoFilePath = "./uploadfiles/upload.mp4";

exports.uploadVideo = (input, title, description, categoryId, tags) => {
  assert(fs.existsSync(videoFilePath));

  fs.readFile("./client_secret.json", (err, content) => {
    if (err) {
      console.log("Error loading client secret file: " + err);
      return;
    }
    authorize(JSON.parse(content), (auth) =>
      uploadVideo(auth, title, description, categoryId, tags)
    );
  });
};

async function uploadVideo(auth, title, description, categoryId, tags) {
  const service = google.youtube("v3");
  const fileSize = fs.statSync(videoFilePath).size;
  const res = await service.videos.insert({
    auth,
    part: "id,snippet,status",
    notifySubscribers: true,
    requestBody: {
      snippet: {
        title,
        description,
        categoryId,
        tags,
      },
      status: {
        privacyStatus: "public",
        madeForKids: false,
        publicStatsViewable: false,
      },
    },
    media: {
      body: fs.createReadStream(videoFilePath),
    },
  });
  if (res.status == 200) {
    console.log("YouTube uploading success...");
  } else console.log(res);
}

function authorize(credentials, callback) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this URL:", authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log("Error while trying to retrieve access token:", err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log("Token stored to " + TOKEN_PATH);
  });
}
