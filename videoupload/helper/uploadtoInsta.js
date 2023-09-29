const { readFile } = require("fs");
const { promisify } = require("util");
const { IgApiClient } = require("instagram-private-api");
const readFileAsync = promisify(readFile);
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function uploadToInstagram(caption) {
  const ig = new IgApiClient();
  ig.state.generateDevice("masterymotivationx");
  const videoPath = "./uploadfiles/upload.mp4";

  await exec(
    `ffmpeg -i ${videoPath} -vframes 1 -q:v 2 ./uploadfiles/cover.jpg -y`
  );

  return new Promise(async (resolve, reject) => {
    try {
      const login = await ig.account.login(
        "masterymotivationx",
        "#qnaLike@007"
      );
      if (login) {
        const videoData = await readFileAsync(videoPath);
        if (videoData) {
          const upload = await ig.publish.video({
            video: videoData,
            coverImage: await readFileAsync("./uploadfiles/cover.jpg"),
            caption,
          });
          if (upload.status == "ok") {
            console.log("Instagram uploading success...");
            resolve(true);
          } else {
            reject(upload);
          }
        } else {
          console.log("Error reading video file.");
          reject("Error reading video file.");
        }
      } else {
        console.log("Login failed.");
        reject("Login failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      reject(error);
    }
  });
}

module.exports = uploadToInstagram;
