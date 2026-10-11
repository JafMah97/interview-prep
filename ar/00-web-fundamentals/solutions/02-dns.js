/**
 * ✅ Solution: Exercise 02: DNS
 *
 * If you got here before trying, go back and try first 😄
 */

// Shared helper: DNS names are case-insensitive, and "example.com." (FQDN)
// means the same thing as "example.com".
function normalize(name) {
  return name.toLowerCase().replace(/\.$/, '');
}

// ------------------------------------------------------------
// 1) isValidHostname
// ------------------------------------------------------------
const LABEL = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;
//              └ first ┘└ middle (may have "-") ┘└ last ┘
// The optional group handles 1-char labels like "a".

export function isValidHostname(name) {
  // Remove ONE trailing dot. A second one leaves an empty label → invalid.
  const host = name.endsWith('.') ? name.slice(0, -1) : name;

  if (host.length === 0 || host.length > 253) return false;

  const labels = host.split('.');

  const labelsOk = labels.every((label) => label.length <= 63 && LABEL.test(label));
  if (!labelsOk) return false;

  // The TLD can't be all digits, otherwise "192.168.1.1" would pass.
  return !/^\d+$/.test(labels.at(-1));
}

// ------------------------------------------------------------
// 2) resolve
// ------------------------------------------------------------
// Real-world idea: follow the CNAME chain, detect cycles with a Set.
// This is the same "have I seen this node before?" trick used for
// cycle detection in linked lists and graphs.
export function resolve(name, zone) {
  const visited = new Set();
  let current = normalize(name);

  while (true) {
    if (visited.has(current)) {
      throw new Error(`CNAME loop detected at "${current}"`);
    }
    visited.add(current);

    // Object.hasOwn: don't let names like "constructor" hit the prototype
    if (!Object.hasOwn(zone, current)) return null; // NXDOMAIN

    const records = zone[current];
    const cname = records.find((r) => r.type === 'CNAME');

    if (!cname) {
      // filter + map returns a NEW array, so the zone is never mutated
      return records.filter((r) => r.type === 'A').map((r) => r.value); // [] = NODATA
    }

    current = normalize(cname.value);
  }
}

// Alternative: recursion with the Set passed down.
// Fine for short chains, but a loop avoids call-stack growth and is
// how real resolvers do it (they also cap the chain length, e.g. 8-16 hops).

// ------------------------------------------------------------
// 3) DnsCache
// ------------------------------------------------------------
export class DnsCache {
  // Private fields (#) can't be touched from outside the class.
  #entries = new Map(); // name → { value, expiresAt }
  #now;

  // Dependency injection: the clock is passed in, so tests can control time.
  constructor(now = Date.now) {
    this.#now = now;
  }

  set(name, value, ttlSeconds) {
    if (ttlSeconds <= 0) return;
    this.#entries.set(normalize(name), {
      value,
      expiresAt: this.#now() + ttlSeconds * 1000,
    });
  }

  // Returns the entry if it's still valid, deletes it if it expired.
  #getEntry(name) {
    const key = normalize(name);
    const entry = this.#entries.get(key);
    if (!entry) return null;

    if (this.#now() >= entry.expiresAt) {
      this.#entries.delete(key);
      return null;
    }
    return entry;
  }

  get(name) {
    // ⚠️ Check the entry, not the value. `entry.value || null` happens to work
    // for [] (arrays are truthy), but would break for falsy values like 0 or "".
    const entry = this.#getEntry(name);
    return entry ? entry.value : null;
  }

  ttlRemaining(name) {
    const entry = this.#getEntry(name);
    if (!entry) return 0;
    return Math.floor((entry.expiresAt - this.#now()) / 1000);
  }

  get size() {
    let count = 0;
    for (const name of this.#entries.keys()) {
      if (this.#getEntry(name)) count++;
    }
    return count;
  }
}

/**
 * 🧠 Takeaways:
 *  1. Normalize input once (lowercase, trailing dot) in a shared helper
 *  2. Validate length BEFORE splitting, and think about what split() returns
 *     for leading/trailing/double separators
 *  3. Cycle detection = a Set of visited nodes (you'll see this again in DSA)
 *  4. NXDOMAIN (null) vs NODATA ([]): "doesn't exist" vs "exists but empty"
 *     are different answers. Don't collapse them
 *  5. Store expiry timestamps, not TTLs. And inject the clock for testability
 *  6. Avoid `value || fallback` when falsy values (0, "", false) can be valid.
 *     Check for existence instead (or use ?? for null/undefined only)
 */
