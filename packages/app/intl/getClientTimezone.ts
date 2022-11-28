/**
 * guess the client timezone
 */
export const getClientTimezone = () => {
  const defaultTimeZone = "Europe/Stockholm";
  try {
    return (
      new Intl.DateTimeFormat()?.resolvedOptions().timeZone ?? defaultTimeZone
    );
  } catch (err) {
    return defaultTimeZone;
  }
};

/**
 * read the client country code from the locale
 */
export const getClientLocaleCountryCode = () =>
  window.navigator?.language?.split("-").slice(-1)[0] ?? "en-GB";
