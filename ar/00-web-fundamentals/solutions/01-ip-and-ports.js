/**
 * ✅ Solution: Exercise 01: IP Addresses & Ports
 *
 * If you got here before trying, go back and try first 😄
 */

// ------------------------------------------------------------
// 1) isValidIPv4
// ------------------------------------------------------------
// Idea: split on "." and validate each part.
//
// ⚠️ The big trap: Number() is way too lenient!
//    Number("1e2")  → 100
//    Number("0x1")  → 1
//    Number(" 1")   → 1
//    Number("")     → 0
// So we first make sure the part is digits only, with a regex: /^\d+$/
export function isValidIPv4(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    if (!/^\d{1,3}$/.test(part)) return false;            // digits only, 1-3 chars (also rejects empty)
    if (part.length > 1 && part[0] === '0') return false; // leading zero
    return Number(part) <= 255;
  });
}

// Alternative: a single regex (good to know, but the version above is
// easier to explain in an interview)
// const octet = '(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)';
// const ipv4Regex = new RegExp(`^${octet}(\\.${octet}){3}$`);

// ------------------------------------------------------------
// 2) isPrivateIPv4
// ------------------------------------------------------------
export function isPrivateIPv4(ip) {
  if (!isValidIPv4(ip)) return false;

  const [a, b] = ip.split('.').map(Number);

  return (
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

// ------------------------------------------------------------
// 3) getDefaultPort
// ------------------------------------------------------------
const DEFAULT_PORTS = {
  http: 80,
  https: 443,
  ws: 80,
  wss: 443,
  ftp: 21,
  ssh: 22,
};

export function getDefaultPort(protocol) {
  const key = protocol.toLowerCase().replace(/:$/, '');

  // ⚠️ Why Object.hasOwn instead of just DEFAULT_PORTS[key] ?? null?
  // Because DEFAULT_PORTS["constructor"] returns a function from the prototype!
  // Alternatives: a Map, or Object.create(null) instead of {}
  return Object.hasOwn(DEFAULT_PORTS, key) ? DEFAULT_PORTS[key] : null;
}

/**
 * 🧠 Takeaways:
 *  1. Number() and parseInt() are lenient: validate the shape with a regex first
 *  2. A lookup table (object/Map) is cleaner than a long if/else chain
 *  3. Watch out for prototype keys when using a plain object as a dictionary
 *  4. Think about edge cases: empty, negative, leading zeros, whitespace
 */
