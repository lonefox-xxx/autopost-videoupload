const axios = require("axios");
const fs = require("fs");
const getBackgroundVideos = require("./getBackgrundVideos");

async function downloadBackgroundVideos(duration) {
  try {
    const urls = await getBackgroundVideos(duration);

    console.log("Downloading background videos...");
    const downloadPromises = urls.map(async (element) => {
      const randomInt = Math.floor(Math.random() * (1000000 - 1000 + 1)) + 1000;
      const outputPath = `./uploadfiles/bg_videos/video_${randomInt}.mp4`;

      const response = await axios({
        url: element,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", () => {
          // console.log("Video downloaded successfully!");
          resolve(outputPath); // Resolve with the file path
        });
        writer.on("error", (error) => {
          console.error("Error downloading video:", error);
          reject(error);
        });
      });
    });

    // Wait for all downloads to complete before resolving the outer promise
    const downloadedFiles = await Promise.all(downloadPromises);

    console.log("Videos downloaded successfully!");
    return downloadedFiles; // You can return an array of downloaded file paths
  } catch (error) {
    console.error("Error downloading videos:", error);
    throw error; // Re-throw the error for proper handling elsewhere if needed
  }
}

module.exports = downloadBackgroundVideos;
