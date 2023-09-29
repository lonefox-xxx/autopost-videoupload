const fs = require("fs");
const util = require("util");
const sleep = require("./sleep");
const exec = util.promisify(require("child_process").exec);

async function createVideoforUpload(duration) {
  const filePath = "./uploadfiles/Audioless_output.mp4";

  if (fs.existsSync(filePath)) {
    console.log("Adding audio to video");
    const addsudiocmd = `ffmpeg -i ${filePath} -i ./uploadfiles/source_audio.mp3 -map 0:v -map 1:a -c:v copy ./uploadfiles/audiovideo.mp4 -y`;
    await exec(addsudiocmd);
  } else {
    console.log(filePath, "does not exist.");
  }

  await sleep(10);

  if (fs.existsSync(filePath)) {
    console.log("Adding subtitlels to video");
    const subtitlelcmd = `ffmpeg -i ./uploadfiles/audiovideo.mp4 -shortest -vf subtitles=./uploadfiles/sub.ass ./uploadfiles/upload_ready.mp4 -y`;
    await exec(subtitlelcmd);
  } else {
    console.log(filePath, "does not exist.");
  }
  await sleep(10);
  console.log("video created...\nproceding to upload...");
}

module.exports = createVideoforUpload;
