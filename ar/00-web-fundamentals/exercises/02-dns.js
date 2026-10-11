/**
 * ============================================================
 *  Exercise 02: DNS
 * ============================================================
 *
 *  Run the tests:
 *    node --test ar/00-web-fundamentals/exercises/02-dns.test.js
 *
 *  Solve the tasks in order and run the tests after each one.
 *  ⚠️ Don't open the solutions folder before you really try!
 */

/**
 * ------------------------------------------------------------
 *  1) isValidHostname(name)
 * ------------------------------------------------------------
 *  Returns true if `name` is a valid DNS hostname, otherwise false.
 *
 *  Rules:
 *    - One optional trailing dot is allowed (FQDN): "example.com."
 *    - Total length (without the trailing dot): 1 to 253 characters
 *    - Labels are separated by "." and each label is 1 to 63 characters
 *    - Labels contain only letters a-z (any case), digits 0-9 and "-"
 *    - A label cannot start or end with "-"
 *    - The last label (the TLD) cannot be all digits
 *      (so "192.168.1.1" is an IP address, not a hostname)
 *
 *  Examples:
 *    isValidHostname("example.com")               → true
 *    isValidHostname("www.example.com.")          → true   (FQDN)
 *    isValidHostname("localhost")                 → true   (single label is fine)
 *    isValidHostname("xn--mgbh0fb.xn--kgbechtv")  → true   (Punycode, Arabic domain)
 *    isValidHostname("-bad.com")                  → false  (starts with "-")
 *    isValidHostname("my_site.com")               → false  ("_" not allowed)
 *    isValidHostname("a..com")                    → false  (empty label)
 *    isValidHostname("192.168.1.1")               → false  (numeric TLD)
 *
 *  💡 Hint: check the total length BEFORE splitting, and think about what
 *     "example.com.".split(".") returns.
 */
export function isValidHostname(name) {
  // Write your solution here
}

/**
 * ------------------------------------------------------------
 *  2) resolve(name, zone)
 * ------------------------------------------------------------
 *  Resolves `name` to its IPv4 addresses using a fake DNS zone,
 *  following CNAME records like a real resolver does.
 *
 *  `zone` is an object: hostname → array of records.
 *  Each record is { type, value }. Example:
 *
 *    const zone = {
 *      'www.shop.com': [{ type: 'CNAME', value: 'shop.com' }],
 *      'shop.com': [
 *        { type: 'A',  value: '203.0.113.10' },
 *        { type: 'A',  value: '203.0.113.11' },
 *        { type: 'MX', value: 'mail.shop.com' },
 *      ],
 *      'ipv6only.com': [{ type: 'AAAA', value: '2001:db8::1' }],
 *    };
 *
 *  Return value:
 *    - An array with the values of all A records       → ['203.0.113.10', '203.0.113.11']
 *    - [] if the name exists but has no A records       → NODATA
 *    - null if the name does not exist in the zone      → NXDOMAIN
 *      (also null if a CNAME points to a missing name)
 *
 *  Rules:
 *    - Names are case-insensitive and may have a trailing dot:
 *      "WWW.Shop.com." is the same as "www.shop.com"
 *      (zone keys are always lowercase without a trailing dot)
 *    - If a name has a CNAME record, follow it (ignore other records there)
 *    - If following CNAMEs leads back to a name already visited,
 *      throw an Error (a CNAME loop). Don't loop forever!
 *
 *  Examples (with the zone above):
 *    resolve('shop.com', zone)       → ['203.0.113.10', '203.0.113.11']
 *    resolve('www.shop.com', zone)   → ['203.0.113.10', '203.0.113.11']
 *    resolve('ipv6only.com', zone)   → []
 *    resolve('nope.com', zone)       → null
 *
 *  💡 Hint: how do you remember which names you've already seen?
 *     Which data structure gives you a fast "have I seen this?" check?
 */
export function resolve(name, zone) {
  // Write your solution here
}

/**
 * ------------------------------------------------------------
 *  3) class DnsCache
 * ------------------------------------------------------------
 *  A cache that respects TTL, like the one inside a resolver.
 *
 *  constructor(now = Date.now)
 *    `now` is a function that returns the current time in milliseconds.
 *    Tests pass a fake clock so they don't have to actually wait.
 *
 *  set(name, value, ttlSeconds)
 *    Stores `value` for `name` for `ttlSeconds` seconds.
 *    If ttlSeconds is 0 or less, don't store anything.
 *
 *  get(name)
 *    Returns the stored value, or null if missing or expired.
 *    Expired entries should be removed.
 *
 *  ttlRemaining(name)
 *    Returns the whole seconds left before expiry (rounded down),
 *    or 0 if missing or expired. (Like the TTL that drops each time
 *    you run Resolve-DnsName.)
 *
 *  size (getter)
 *    Number of entries that are NOT expired.
 *
 *  Names are case-insensitive and ignore a trailing dot (same as resolve).
 *
 *  Example:
 *    let t = 0;
 *    const cache = new DnsCache(() => t);
 *    cache.set('example.com', ['203.0.113.10'], 300);
 *    cache.get('example.com');           → ['203.0.113.10']
 *    t = 100_000;                        // 100 seconds later
 *    cache.ttlRemaining('example.com');  → 200
 *    t = 300_000;                        // 300 seconds later
 *    cache.get('example.com');           → null (expired)
 *
 *  💡 Hint: store the expiry time (a timestamp), not the TTL itself.
 *     A Map is a good fit here.
 */
export class DnsCache {
  constructor(now = Date.now) {
    // Write your solution here
  }

  set(name, value, ttlSeconds) {
    // Write your solution here
  }

  get(name) {
    // Write your solution here
  }

  ttlRemaining(name) {
    // Write your solution here
  }

  get size() {
    // Write your solution here
  }
}
