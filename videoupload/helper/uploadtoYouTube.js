const { upload } = require("youtube-videos-uploader");

async function uploadtoYoutube(title, description) {
  const path = "./uploadfiles/upload.mp4";
  const credentials = {
    email: "mindmorsels333@gmail.com",
    pass: "#qnaLike@007",
    recoveryemail: "babinclt055@gmail.com",
  };

  const onVideoUploadSuccess = (videoUrl) => {
    return videoUrl;
  };

  const video2 = {
    path,
    title,
    description,
    language: "english",
    channelName: "MindMorselsUnleashed",
    onSuccess: onVideoUploadSuccess,
    skipProcessingWait: true,
    uploadAsDraft: false,
    isAgeRestriction: false,
    isNotForKid: true,
    publishType: "PUBLIC",
    isChannelMonetized: false,
  };

  try {
    const result = await upload(credentials, [video2]);
    console.log("YouTube uploading success...");
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

module.exports = uploadtoYoutube;
