import crypto from 'crypto';

// Finds all longest increasing substrings (strictly increasing letters) in a string
function getLongestIncreasingSubstrings(str) {
  let substrings = [];
  let maxLength = 0;

  let current = str[0] || '';
  let start = 0;

  for (let i = 1; i <= str.length; i++) {
    if (i < str.length && str[i] > str[i - 1]) {
      current += str[i];
    } else {
      // Check if current substring length is max or equals max
      if (current.length > maxLength) {
        maxLength = current.length;
        substrings = [{ value: current, start: start, end: i - 1 }];
      } else if (current.length === maxLength && maxLength > 0) {
        substrings.push({ value: current, start: start, end: i - 1 });
      }
      current = str[i] || '';
      start = i;
    }
  }

  return substrings;
}

// Hash product name with md5, take first 8 chars (hex)
function hashProductName(name) {
  return crypto.createHash('md5').update(name).digest('hex').slice(0, 8);
}

// Generate product code based on name
function generateProductCode(name) {
  if (!name || typeof name !== 'string') return null;

  // Lowercase and strip non-letter chars (a-z)
  const lower = name.toLowerCase().replace(/[^a-z]/g, '');

  if (lower.length === 0) return null; // no valid letters

  const substrings = getLongestIncreasingSubstrings(lower);
  if (substrings.length === 0) return null;

  // Combine all longest increasing substrings
  const combinedSubstr = substrings.map(s => s.value).join('');
  const startIndex = substrings[0].start;
  const endIndex = substrings[substrings.length - 1].end;

  const hash = hashProductName(name);

  // Format: hash-startIndex + combined substring + endIndex
  return `${hash}-${startIndex}${combinedSubstr}${endIndex}`;
}

export default generateProductCode;
