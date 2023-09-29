const axios = require("axios");

async function transcript(videoId) {
  const RE_YOUTUBE =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

  return new Promise(async (resolve, reject) => {
    // console.log(videoId);
    const identifier = retrieveVideoId(videoId);
    const { body: videoPageBody } = await sendproxyreq({
      url: `https://www.youtube.com/watch?v=${identifier}`,
    });

    const innerTubeApiKey = videoPageBody
      .toString()
      .split('"INNERTUBE_API_KEY":"')[1]
      .split('"')[0];

    if (innerTubeApiKey && innerTubeApiKey.length > 0) {
      let videoPageBodyString = videoPageBody.toString(); // Assuming videoPageBody is a buffer or similar
      const requestData = generateRequest(videoPageBodyString);
      const url = `https://www.youtube.com/youtubei/v1/get_transcript?key=${innerTubeApiKey}`;
      const requestDataString = JSON.stringify(requestData);

      const requestOptions = {
        url,
        headers: ["Content-Type: application/json"],
        method: "POST",
        data: requestDataString,
      };
      try {
        const { body: resdata } = await sendproxyreq(requestOptions);
        const data = JSON.parse(resdata);
        if (data.responseContext) {
          if (!data.actions) {
            throw new Error("Transcript is disabled on this video");
          }

          const transcriptRenderer =
            data.actions[0]?.updateEngagementPanelAction?.content
              ?.transcriptRenderer;

          if (transcriptRenderer) {
            const transcripts =
              transcriptRenderer.body?.transcriptBodyRenderer?.cueGroups;

            if (transcripts) {
              const cap = transcripts.map((cue) => ({
                text:
                  cue.transcriptCueGroupRenderer.cues[0]?.transcriptCueRenderer
                    ?.cue.simpleText || "",
                duration: parseInt(
                  cue.transcriptCueGroupRenderer.cues[0]?.transcriptCueRenderer
                    ?.durationMs || "0"
                ),
                offset: parseInt(
                  cue.transcriptCueGroupRenderer.cues[0]?.transcriptCueRenderer
                    ?.startOffsetMs || "0"
                ),
              }));
              resolve(cap);
            } else {
              throw new Error("No transcript data available");
            }
          } else {
            throw new Error("Transcript renderer not found in the response");
          }
        }
      } catch (error) {
        // Handle any errors here
        console.error(error);
      }
    }

    function retrieveVideoId(videoId) {
      if (videoId.length === 11) {
        return videoId;
      }
      const matchId = videoId.match(RE_YOUTUBE);
      if (matchId && matchId.length) {
        return matchId[1];
      }
      throw new Error("Invalid YouTube video ID");
    }

    function generateRequest(page, config) {
      const params = page.split('"serializedShareEntity":"')[1]?.split('"')[0];
      const visitorData = page.split('"VISITOR_DATA":"')[1]?.split('"')[0];
      const sessionId = page.split('"sessionId":"')[1]?.split('"')[0];
      const clickTrackingParams = page
        ?.split('"clickTrackingParams":"')[1]
        ?.split('"')[0];
      // Define or replace this function with an appropriate value or logic

      return {
        context: {
          client: {
            hl: config?.lang || "fr",
            gl: config?.country || "FR",
            visitorData,
            userAgent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)",
            clientName: "WEB",
            clientVersion: "2.20200925.01.00",
            osName: "Macintosh",
            osVersion: "10_15_4",
            browserName: "Chrome",
            browserVersion: "85.0f.4183.83",
            screenWidthPoints: 1440,
            screenHeightPoints: 770,
            screenPixelDensity: 2,
            utcOffsetMinutes: 120,
            userInterfaceTheme: "USER_INTERFACE_THEME_LIGHT",
            connectionType: "CONN_CELLULAR_3G",
          },
          request: {
            sessionId,
            internalExperimentFlags: [],
            consistencyTokenJars: [],
          },
          user: {},
          clientScreenNonce: generateNonce(),
          clickTracking: {
            clickTrackingParams,
          },
        },
        params,
      };
    }

    function generateNonce() {
      const rnd = Math.random().toString();
      const alphabet =
        "ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghjijklmnopqrstuvwxyz0123456789";
      const jda = [
        alphabet + "+/=",
        alphabet + "+/",
        alphabet + "-_=",
        alphabet + "-_.",
        alphabet + "-_",
      ];
      const b = jda[3];
      const a = [];

      for (let i = 0; i < rnd.length; i++) {
        a.push(rnd.charCodeAt(i));
      }

      let c = "";
      let d = 0;
      let m, n, q, r, f, g;

      while (d < a.length) {
        f = a[d];
        g = d + 1 < a.length;

        if (g) {
          m = a[d + 1];
        } else {
          m = 0;
        }
        n = d + 2 < a.length;
        if (n) {
          q = a[d + 2];
        } else {
          q = 0;
        }
        r = f >> 2;
        f = ((f & 3) << 4) | (m >> 4);
        m = ((m & 15) << 2) | (q >> 6);
        q &= 63;

        if (!n) {
          q = 64;
          if (!g) {
            m = 64;
          }
        }

        c += b[r] + b[f] + b[m] + b[q];
        d += 3;
      }

      return c;
    }

    async function sendproxyreq(data) {
      return new Promise(async (resolve, reject) => {
        const options = {
          method: "POST",
          url: "https://scrapeninja.p.rapidapi.com/scrape",
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key":
              "9a5ffccc56msh3fbe8f119253d81p132ea1jsnfe28fe7b7f06",
            "X-RapidAPI-Host": "scrapeninja.p.rapidapi.com",
          },
          data,
        };

        try {
          const response = await axios.request(options);
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      });
    }
  });
}

module.exports = transcript;
