const axios = require("axios");
const apiKey = "AIzaSyB9cK6LyhuKg1_wGengyD08pHD6fDQe43c";
const moment = require("moment");

async function findVideo(videoids) {
  const {
    data: { uploadedVideos },
  } = await axios.get("https://autopost.madbotz.live/uploadedvideos");

  if (uploadedVideos == null) return console.log("no channels");

  const remaingVideos = videoids.filter(
    (item) => !uploadedVideos.includes(item)
  );

  const shortvideos = await checkDuration(remaingVideos);
  const captionedvideo = await getVideoID(shortvideos);
  if (shortvideos != []) {
    return {
      success: true,
      video: captionedvideo,
    };
  } else {
    return { success: false, video: null };
  }
}

async function checkDuration(videoArray) {
  const seletedVideoArray = [];

  // Wrap the axios call in a Promise
  const fetchVideoData = async (element) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            key: apiKey,
            id: element,
            part: "snippet,contentDetails",
          },
        }
      );

      const video = response.data.items[0];
      const duration = video.contentDetails.duration;

      if (isVideoDurationLessThan60Seconds(duration)) {
        const res = {
          videoId: element,
          catogoryId: video.snippet.categoryId,
          tittle: video.snippet.title,
          duration,
        };
        seletedVideoArray.push(res);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Use Promise.all to fetch video data for all elements
  await Promise.all(videoArray.map((element) => fetchVideoData(element)));

  return seletedVideoArray;
}

function isVideoDurationLessThan60Seconds(duration) {
  const duratinInSeconds = moment.duration(duration).asSeconds();
  return duratinInSeconds <= 60;
}

async function getVideoID(videos) {
  // console.log(videos);
  // const captionVideos = [];
  // for (const element of videos) {
  //   const response = await axios.get(
  //     `https://www.googleapis.com/youtube/v3/captions?videoId=${element.videoId}&part=snippet&key=${apiKey}`
  //   );
  //   if (response.data.items.length > 0) {
  //     captionVideos.push(element);
  //   }
  // }
  return videos[Math.floor(Math.random() * videos.length)];
}

module.exports = findVideo;
