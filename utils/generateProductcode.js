import crypto from 'crypto';

function getLongestIncreasingSubstrings(str) {
  let substrings = [];
  let maxLength = 0;

  let current = str[0];
  let start = 0;

  for (let i = 1; i <= str.length; i++) {
    if (i < str.length && str[i] > str[i - 1]) {
      current += str[i];
    } else {
      if (current.length > maxLength) {
        maxLength = current.length;
        substrings = [{ value: current, start: start, end: i - 1 }];
      } else if (current.length === maxLength) {
        substrings.push({ value: current, start: start, end: i - 1 });
      }
      current = str[i];
      start = i;
    }
  }

  return substrings;
}

function hashProductName(name) {
  return crypto.createHash('md5').update(name).digest('hex').slice(0, 8);
}

function generateProductCode(name) {
  if (!name || typeof name !== 'string') return null;

  const lower = name.toLowerCase().replace(/[^a-z]/g, ''); // ignore spaces/special chars

  // Return null if cleaned name is empty (no letters)
  if (lower.length === 0) return null;

  const substrings = getLongestIncreasingSubstrings(lower);

  if (substrings.length === 0) return null;

  const combinedSubstr = substrings.map(s => s.value).join('');
  const startIndex = substrings[0].start;
  const endIndex = substrings[substrings.length - 1].end;

  const hash = hashProductName(name);

  return `${hash}-${startIndex}${combinedSubstr}${endIndex}`;
}


export default generateProductCode;