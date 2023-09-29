const videoUploader = require("./uploader");

async function uploadHandeler() {
  const maxupload = 2;
  for (let i = 0; i < maxupload; i++) {
    console.log(`lokking for ${i + 1} upload`);
    videoUploader();
    await sllep(32400000);
  }

  function sllep(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }
}

function uploadHandelerManager() {
  const now = new Date();
  const currentTime = now.getTime();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const timeUntilMidnight = midnight - currentTime;

  setTimeout(() => {
    console.log("upload handler reseted");
    uploadHandeler();
    uploadHandelerManager();
  }, timeUntilMidnight);
}

console.log("upload handler started");

module.exports = uploadHandelerManager;
