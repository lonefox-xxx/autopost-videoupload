const collectMP4FilePaths = require("./collectMP4FilePaths");
const concatenateAndReencodeVideos = require("./concatVideos");
const downloadBackgroundVideos = require("./downloadBackgroundVideos");

async function generateBackgroundVideos(duration) {
  await downloadBackgroundVideos(duration);
  const videoPaths = collectMP4FilePaths("./uploadfiles/bg_videos");
  await concatenateAndReencodeVideos(
    videoPaths,
    "./uploadfiles/bg_video/output_final.mp4"
  );
}

module.exports = generateBackgroundVideos;
