const fs = require("fs");
const util = require("util");
const sleep = require("./sleep");
const exec = util.promisify(require("child_process").exec);

async function concatenateAndReencodeVideos(videoPaths, outputFilePath) {
  try {
    console.log("Reencoding videos...");
    const reencodedVideoPaths = [];
    for (let i = 0; i < videoPaths.length; i++) {
      const inputVideo = videoPaths[i];
      const outputVideo = `./uploadfiles/reencoded_videos/reencoded_video_${i}.mp4`;
      const reencodeCommand = `ffmpeg -i ${inputVideo} -c:v libx264 -c:a aac -strict experimental -b:a 192k -r 30 ${outputVideo} -y`;
      await exec(reencodeCommand);
      reencodedVideoPaths.push(outputVideo);
      fs.unlink(videoPaths[i], (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          // console.log("Video file deleted successfully");
        }
      });
    }
    const listFilePath = "list.txt";
    const listFileContent = reencodedVideoPaths
      .map((video) => `file '${video}'`)
      .join("\n");
    fs.writeFileSync(listFilePath, listFileContent);

    console.log("Concating background videos");

    const concatenateCommand = `ffmpeg -f concat -safe 0 -i ${listFilePath} -c:v copy -c:a copy ${outputFilePath} -y`;
    await exec(concatenateCommand);

    reencodedVideoPaths.forEach((path) => {
      fs.unlink(path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          // console.log("Video file deleted successfully");
        }
      });
    });
    await sleep(10);

    console.log("Adding filter to background video");

    const filterCommand = `ffmpeg -i ${outputFilePath} -c:v libx264 -an -vf "eq=contrast=1.50:brightness=-0.38:saturation=-50,scale=1080:1920" -c:a copy ${outputFilePath.replace(
      "output_final.mp4",
      "output.mp4"
    )} -y`;
    await exec(filterCommand);
    console.log("filter added to background video");

    console.log("romoving existing audio from background video");

    const removeaudio = `ffmpeg -i ./uploadfiles/bg_video/output.mp4 -an -c copy -y ./uploadfiles/Audioless_output.mp4 -y`;

    await exec(removeaudio);

    await sleep(10);
    console.log("existing audio removed");
    console.log(`rendering completed completed. Output saved`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

module.exports = concatenateAndReencodeVideos;
