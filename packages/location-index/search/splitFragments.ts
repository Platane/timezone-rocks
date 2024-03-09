/**
 * split a text in normal and highlighted fragments
 */
export const splitFragments = (
  normalizedPattern: string,
  normalizedText: string,
  originalText = normalizedText
) => {
  const fragments: TextFragments = [];

  if (originalText.length !== normalizedText.length) {
    originalText = normalizedText;
  }

  if (originalText.length === 0) {
    return fragments;
  }

  if (normalizedPattern.length === 0) {
    fragments.push({ match: false, text: originalText });
    return fragments;
  }

  let a = 0;
  let b = 0;
  while ((b = normalizedText.indexOf(normalizedPattern, a)) !== -1) {
    // avoid repeating adjacent highlighted fragment
    if (b > 0 && a === b) {
      const last = fragments[fragments.length - 1];
      if (!last.match) {
        last.text += originalText.substring(b, b + normalizedPattern.length);
      } else {
        fragments.push({
          match: false,
          text: originalText.substring(b, b + normalizedPattern.length),
        });
      }
    } else {
      if (b > a) {
        fragments.push({
          match: false,
          text: originalText.substring(a, b),
        });
      }

      fragments.push({
        match: true,
        text: originalText.substring(b, b + normalizedPattern.length),
      });
    }

    a = b + normalizedPattern.length;
  }

  if (a < normalizedText.length) {
    fragments.push({
      match: false,
      text: originalText.substring(a, normalizedText.length),
    });
  }

  return fragments;
};

export type TextFragments = { match: boolean; text: string }[];
