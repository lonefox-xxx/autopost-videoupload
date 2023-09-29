const findVideo = require("./findVideo");
const getVideos = require("./getvideos");
const { default: axios } = require("axios");

async function getvideoForUpload(ChannelId) {
  const videos = await getVideos(ChannelId);
  const videofroUpload = await findVideo(videos);
  if (videofroUpload.success) {
    axios
      .post("https://autopost.madbotz.live/updateuploadedvideos", {
        videoid: videofroUpload.video.videoId,
      })
      .then(({ data }) => {
        // console.log(data);
      });
  }
  return videofroUpload;
}

module.exports = getvideoForUpload;
