const { default: axios } = require("axios");

async function getchannel() {
  try {
    const {
      data: { channels },
    } = await axios.get("https://autopost.madbotz.live/channelsforcontend");

    if (channels == null) return console.log("no Channels found");

    const selectedChannel =
      channels[Math.floor(Math.random() * channels.length)];
    return {
      success: true,
      selectedChannel,
      msg: "success",
    };
  } catch (error) {
    return { success: false, msg: error, selectedChannel: null };
  }
}

module.exports = getchannel;
