const fs = require("fs");
const { getVideoDurationInSeconds } = require("get-video-duration");
const { promisify } = require("util");
const uploadToInstagram = require("./uploadtoInsta");
const rename = promisify(fs.rename);
const { exec } = require("child_process");
const sleep = require("./sleep");
const uploadtoYoutube = require("./uploadtoYouTube");

const execPromise = promisify(exec);

async function uploadHandler(tittle, categoryId, metadata) {
  const duration = await getVideoDurationInSeconds(
    "./uploadfiles/upload_ready.mp4"
  );

  if (duration > 60) {
    console.log("high duration");
    const { stdout, stderr } = await execPromise(
      `ffmpeg -i ./uploadfiles/upload_ready.mp4 -ss 00:00:00 -t 00:01:00 -y ./uploadfiles/upload.mp4`
    );
    if (stderr) {
      throw new Error(`Error cutting video: ${stderr}`);
    }
    fs.unlink("./uploadfiles/upload_ready.mp4", (err) => console.log);
  } else {
    await rename(
      "./uploadfiles/upload_ready.mp4",
      "./uploadfiles/upload.mp4"
    ).catch((err) => {
      console.log(err);
    });
  }
  await sleep(10);

  await Promise.allSettled([
    console.log("Uploading To Youtube"),
    uploadtoYoutube(tittle, metadata[1].value.summary),
    console.log("Uploading To Instagram"),
    uploadToInstagram(tittle),
  ]);

  console.log("Uploading Completed...");

  // clean up unwanted files
  const filesToDelete = [
    "./uploadfiles/bg_video/output_final.mp4",
    "./uploadfiles/bg_video/output.mp4",
    "./uploadfiles/Audioless_output.mp4",
    "./uploadfiles/audiovideo.mp4",
    "./uploadfiles/source_audio.mp3",
    "./uploadfiles/sub.ass",
    "./uploadfiles/upload.mp4",
    "./uploadfiles/cover.jpg",
  ];

  for (const path of filesToDelete) {
    try {
      await fs.promises.unlink(path);
      // console.log("File deleted successfully:", path);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }
}

module.exports = uploadHandler;
