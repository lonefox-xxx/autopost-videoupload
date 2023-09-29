const fs = require("fs");
const transcript = require("./transcript");

async function generateSubtitles(videoId, duration) {
  const summaryArray = [];
  await transcript(videoId).then((transcript) => {
    function cutDeci(number) {
      if (number <= 0) return number;
      const tens = Math.round(number / 10) * 10;
      const roundedWithoutLastDigit = parseInt(tens.toString().slice(0, -1));
      return roundedWithoutLastDigit;
    }

    function millisecondsToASS(time) {
      const milliseconds = time % 1000;
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / (1000 * 60)) % 60);
      const hours = Math.floor(time / (1000 * 60 * 60));
      return `${hours <= 10 ? "0" + hours : hours}:${
        minutes <= 10 ? "0" + minutes : minutes
      }:${seconds <= 10 ? "0" + seconds : seconds}.${cutDeci(milliseconds)}`;
    }

    const assHeader = `[Script Info]
Title: Random Subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.601
PlayResX: 1280
PlayResY: 720

[V4+ Styles]2
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding ,MarginT

Style: main, Amiko-Bold, 34, &HFFFFFF, &H000000, &H000000, &H80000000, 700, 1, 0, 0, 100, 100, 0, 0, 3, 0, 0, 5, 30, 30, 0, 0, 0
Style: channelHandle, ./Amiko/Amiko-Bold.ttf, 24, &HFFFFFFF, &FFFFFFFF, &H000000, &H80000000, 0, 0, 0, 0, 100, 100, 0, 0, 3, 0, 0, 2, 10, 10, 150, 0,0

Dialogue: 0, 00:00:00.000, ${millisecondsToASS(
      duration * 1000
    )}, channelHandle, , 0, 0, 0,,  {\alpha&H80&} @MasteryMotivation

`;

    const assLines = transcript.map((entry, i) => {
      const next_off =
        i < transcript.length - 1
          ? transcript[i + 1].offset
          : transcript[i].offset + entry.duration;

      const startTime = millisecondsToASS(transcript[i].offset);
      const endTime = millisecondsToASS(next_off);
      if (
        entry.text == "[Music]" ||
        entry.text == "[Applause]" ||
        entry.text == "[Laughter]" ||
        entry.text == "[Interruption]"
      )
        return "";
      summaryArray.push(entry.text);
      return `Dialogue: 0,${startTime},${endTime},main, , 0, 0, 0,, ${entry.text}\n`;
    });

    const assText = assHeader + assLines.join("");

    fs.writeFileSync("./uploadfiles/sub.ass", assText, "utf-8");
    console.log("Subtitle generated");
  });
  return { summary: summaryArray.join(`\n`) };
}

module.exports = generateSubtitles;
