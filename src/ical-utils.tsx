export const generateICal = ({
  summary,
  startDate,
  url,
  uid = url,
}: {
  summary?: string;
  startDate: number;
  url: string;
  uid?: string;
}) =>
  `
BEGIN:VCALENDAR
CALSCALE:GREGORIAN
VERSION:2.0
BEGIN:VEVENT    
DTSTAMP:${toISODateTime(startDate)}
DTSTART:${toISODate(startDate)}
SUMMARY:${summary ?? "-"}
UID:${uid}
URL:${url}
END:VEVENT
END:VCALENDAR
`.trim();

const toISODate = (t: number) => toISODateTime(t).slice(0, 8);
const toISODateTime = (t: number) =>
  new Date(t).toISOString().replace(/([-:]|\.\d+)/g, "");
