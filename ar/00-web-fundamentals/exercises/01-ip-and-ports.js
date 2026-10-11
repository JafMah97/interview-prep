/**
 * ============================================================
 *  Exercise 01: IP Addresses & Ports
 * ============================================================
 *
 *  Run the tests:
 *    node --test ar/00-web-fundamentals/exercises/01-ip-and-ports.test.js
 *
 *  ⚠️ Don't open the solutions folder before you really try!
 */

/**
 * ------------------------------------------------------------
 *  1) isValidIPv4(ip)
 * ------------------------------------------------------------
 *  Returns true if the string is a valid IPv4 address, otherwise false.
 *
 *  Rules:
 *    - Exactly 4 parts, separated by "."
 *    - Each part is a number from 0 to 255
 *    - Each part contains digits only (no letters, spaces, signs...)
 *    - No leading zeros: "01" or "001" are invalid, but "0" alone is fine
 *    - No empty parts
 *
 *  Examples:
 *    isValidIPv4("192.168.1.1")   → true
 *    isValidIPv4("0.0.0.0")       → true
 *    isValidIPv4("256.1.1.1")     → false  (greater than 255)
 *    isValidIPv4("192.168.01.1")  → false  (leading zero)
 *    isValidIPv4("192.168.1")     → false  (only 3 parts)
 *    isValidIPv4("1.2.3.4.")      → false  (empty last part)
 *
 *  💡 Hint: what does Number() return for "1e2", " 1" or ""?
 */

export function isValidIPv4(ip) {
  // Write your solution here
  let answer = true
  const parts = ip.split(".")
  const exp = /^\d+$/ // used ai for this regular exp

  for (let part of parts){
    if (!exp.test(part) || parts.length !== 4) {
      answer = false;
      break;
  }
    if (part.length == 0 || (part.startsWith("0") && part.length > 1)  || (Number(part) > 255 || Number(part)<0)) {
      answer = false;
      break;
    }
    continue
  }
  return answer
}

/**
 * ------------------------------------------------------------
 *  2) isPrivateIPv4(ip)
 * ------------------------------------------------------------
 *  Returns true if the address is inside a private range:
 *    10.0.0.0     →  10.255.255.255
 *    172.16.0.0   →  172.31.255.255
 *    192.168.0.0  →  192.168.255.255
 *
 *  - Not a valid IPv4 address → false
 *  - 127.0.0.1 (loopback) → false, it is NOT private!
 *
 *  Examples:
 *    isPrivateIPv4("192.168.1.10")  → true
 *    isPrivateIPv4("172.20.5.5")    → true
 *    isPrivateIPv4("172.32.0.1")    → false
 *    isPrivateIPv4("8.8.8.8")       → false
 *
 *  💡 Hint: reuse the isValidIPv4 you wrote above
 */
export function isPrivateIPv4(ip) {
  const parts = ip.split(".")
  if (!isValidIPv4(ip)){
    return false
  }

  if (ip.startsWith("10.") || ip.startsWith("192.168.") ){
    return true
  }
  if ( ip.startsWith("172") && (Number(parts[1]) > 15 && Number(parts[1]) < 32) ) {
    return true
  }
  return false
}

/**
 * ------------------------------------------------------------
 *  3) getDefaultPort(protocol)
 * ------------------------------------------------------------
 *  Returns the default port (as a number) for a protocol:
 *    http → 80     https → 443
 *    ws   → 80     wss   → 443
 *    ftp  → 21     ssh   → 22
 *
 *  - Must work with or without a trailing ":"   ("https" or "https:")
 *  - Must be case-insensitive ("HTTPS")
 *  - Unknown protocol → null
 *
 *  Examples:
 *    getDefaultPort("https")   → 443
 *    getDefaultPort("HTTP:")   → 80
 *    getDefaultPort("gopher")  → null
 *
 *  💡 Hint: an object as a lookup table beats a long if/else chain
 */

export function getDefaultPort(protocol) {

  let p = protocol.toLowerCase();

  if (p.endsWith(":")){
    p = p.slice(0,p.length - 1)
  };

  const protocolObj = {
    http:80,
    https:443,
    ws:80,
    wss:443,
    ftp:21,
    ssh:22,
    smtp:25,
    dns:53,
    postgresql:5432,
    mongodb:27017,
    backend:8080,
    react:3000,
    vite:5173
  }
    for (let i in Object.keys(protocolObj) )
  {
    if (p === Object.keys(protocolObj)[i]) {
      return Object.values(protocolObj)[i]
    }
  }
  return null
}
