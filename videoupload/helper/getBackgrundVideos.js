const getVideos = require("./getDownloadVideos");
async function getBackgroundVideos(requiredDuration) {
  return new Promise(async (resolve, reject) => {
    let duration = 0;
    let total = 0;
    const linkArray = [];
    for (let i = 0; requiredDuration > duration; i++) {
      const item = await getVideos(3, 10);
      if (item) {
        total++;
        duration += item.duration;
        linkArray.push(item.link);
      }
    }
    resolve(linkArray);
  });
}

module.exports = getBackgroundVideos;
