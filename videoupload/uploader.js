const generateBackgroundVideos = require("./helper/genarateBackgroundVideos");
const generateSubtitles = require("./helper/genarateSubtitle");
const getchannel = require("./helper/getchannels");
const getvideoForUpload = require("./helper/getvideoforupload");
const util = require("util");
const { exec } = require("child_process");
const { getAudioDurationInSeconds } = require("get-audio-duration");
const createVideoforUpload = require("./helper/createVideoforUplload");
const path = require("path");
const uploadHandler = require("./helper/uploaderHandler");
const sleep = require("./helper/sleep");

const execAsync = util.promisify(exec);

async function videoUploader() {
  try {
    console.log("Creating video for upload...");
    const channel = await getchannel();
    const selectedChannel = channel.selectedChannel;
    const {
      video: { videoId, catogoryId, tittle, duration },
    } = await getvideoForUpload(selectedChannel);

    // console.log(videoId, tittle, catogoryId);

    const audioCmd = `youtube-exec audio --url "https://www.youtube.com/watch?v=${videoId}" --folder "uploadfiles" --filename "source_audio" --quality "best"`;

    await execAsync(audioCmd);
    console.log("Successfully downloaded audio");

    await sleep(10);

    const duratinInSeconds = await getAudioDurationInSeconds(
      "./uploadfiles/source_audio.mp3"
    );

    const metadata = await Promise.allSettled([
      generateBackgroundVideos(duratinInSeconds),
      generateSubtitles(videoId, duratinInSeconds),
    ]);

    await sleep(10);

    await createVideoforUpload(duratinInSeconds);

    await sleep(10);
    await uploadHandler(tittle, catogoryId, metadata);
  } catch (error) {
    console.error(error);
  }
}

module.exports = videoUploader;
