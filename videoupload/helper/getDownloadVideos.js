const axios = require("axios");

async function getPagesCount(query, per_page) {
  const apiKey = "TNaWTm1SZKIHit80hyaATWYSkW6qWUew0fFOpe8PCtatUZSM0Zt2WaPJ";
  const url = `https://api.pexels.com/v1/videos/search/?orientation=portrait&per_page=${per_page}&query=${query}&size=all`;
  const config = {
    headers: {
      Authorization: apiKey,
    },
  };
  const {
    data: { total_results },
  } = await axios.get(url, config);
  const pages = total_results / per_page;
  return { pages: Math.ceil(pages), total_results };
}

function getTopics() {
  const TopicsArray = [
    "money",
    "luxury",
    "nature",
    "motivation",
    "hard work",
    "success",
    "team work",
    "focus",
    "plan",
    "chess",
  ];

  const ranind =
    Math.floor(Math.random() * TopicsArray.length - 1 - 1 - 0 + 1) + 0;
  return TopicsArray[ranind];
}

async function getVideos(minduration, maxduration) {
  const apiKey = "TNaWTm1SZKIHit80hyaATWYSkW6qWUew0fFOpe8PCtatUZSM0Zt2WaPJ";
  const topic = getTopics();
  const { pages } = await getPagesCount(topic, 15);
  const randomPage = Math.abs(
    Math.abs(Math.floor(Math.random() * (pages - 1 + 1)) + 1)
  );
  // console.log(randomPage);
  const url = `https://api.pexels.com/v1/videos/search/?orientation=portrait&page=${randomPage}&per_page=15&query=${topic}&size=all`;
  const config = {
    headers: {
      Authorization: apiKey,
    },
  };
  const {
    data: { videos },
  } = await axios.get(url, config);

  const filteredVideos = videos.filter(
    (video) => video.duration > minduration && video.duration < maxduration
  );

  const length = filteredVideos.length;
  const randomIndex = Math.abs(
    Math.floor(Math.random() * (length - 1 - 0 + 1)) + 1
  );

  const randomElement = filteredVideos[randomIndex];
  const item = randomElement?.video_files?.find(
    (file, i) => file.quality === "hd"
  );
  // console.log(item);
  const duration = randomElement?.duration || 0;
  if (item) return { duration, link: item.link };
}

module.exports = getVideos;
