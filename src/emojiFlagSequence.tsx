export const getFlagEmoji = (countyCode: string) =>
  flagSequence[parseInt(countyCode[0], 36) - 10] +
  flagSequence[parseInt(countyCode[1], 36) - 10];

const flagSequence = [
  `🇦`,
  `🇧`,
  `🇨`,
  `🇩`,
  `🇪`,
  `🇫`,
  `🇬`,
  `🇭`,
  `🇮`,
  `🇯`,
  `🇰`,
  `🇱`,
  `🇲`,
  `🇳`,
  `🇴`,
  `🇵`,
  `🇶`,
  `🇷`,
  `🇸`,
  `🇹`,
  `🇺`,
  `🇻`,
  `🇼`,
  `🇽`,
  `🇾`,
  `🇿`,
];
