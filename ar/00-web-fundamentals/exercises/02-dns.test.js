import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isValidHostname, resolve, DnsCache } from './02-dns.js';

describe('1) isValidHostname', () => {
  it('accepts normal hostnames', () => {
    assert.equal(isValidHostname('example.com'), true);
    assert.equal(isValidHostname('www.example.com'), true);
    assert.equal(isValidHostname('api.v2.my-site.dev'), true);
    assert.equal(isValidHostname('EXAMPLE.COM'), true);
    assert.equal(isValidHostname('3com.com'), true);
  });

  it('accepts a single label', () => {
    assert.equal(isValidHostname('localhost'), true);
  });

  it('accepts one trailing dot (FQDN), but not two', () => {
    assert.equal(isValidHostname('www.example.com.'), true);
    assert.equal(isValidHostname('www.example.com..'), false);
  });

  it('accepts Punycode (IDN) names', () => {
    assert.equal(isValidHostname('xn--mgbh0fb.xn--kgbechtv'), true);
  });

  it('rejects empty names and empty labels', () => {
    assert.equal(isValidHostname(''), false);
    assert.equal(isValidHostname('.'), false);
    assert.equal(isValidHostname('a..com'), false);
    assert.equal(isValidHostname('.example.com'), false);
  });

  it('rejects labels starting or ending with "-"', () => {
    assert.equal(isValidHostname('-bad.com'), false);
    assert.equal(isValidHostname('bad-.com'), false);
    assert.equal(isValidHostname('ok.-bad'), false);
  });

  it('rejects invalid characters', () => {
    assert.equal(isValidHostname('my_site.com'), false);
    assert.equal(isValidHostname('my site.com'), false);
    assert.equal(isValidHostname('café.com'), false); // non-ASCII must be Punycode first
    assert.equal(isValidHostname('example.com/path'), false);
  });

  it('enforces the 63-character label limit', () => {
    assert.equal(isValidHostname('a'.repeat(63) + '.com'), true);
    assert.equal(isValidHostname('a'.repeat(64) + '.com'), false);
  });

  it('enforces the 253-character total limit', () => {
    const label = 'a'.repeat(63);
    const name253 = [label, label, label, 'a'.repeat(61)].join('.'); // 63*3 + 61 + 3 dots = 253
    assert.equal(name253.length, 253);
    assert.equal(isValidHostname(name253), true);
    assert.equal(isValidHostname(name253 + '.'), true); // trailing dot doesn't count
    assert.equal(isValidHostname(name253 + 'a'), false);
  });

  it('rejects an all-numeric TLD (that is an IP, not a hostname)', () => {
    assert.equal(isValidHostname('192.168.1.1'), false);
    assert.equal(isValidHostname('example.123'), false);
  });
});

describe('2) resolve', () => {
  const zone = {
    'shop.com': [
      { type: 'A', value: '203.0.113.10' },
      { type: 'A', value: '203.0.113.11' },
      { type: 'MX', value: 'mail.shop.com' },
    ],
    'www.shop.com': [{ type: 'CNAME', value: 'shop.com' }],
    'm.shop.com': [{ type: 'CNAME', value: 'www.shop.com' }],
    'ipv6only.com': [{ type: 'AAAA', value: '2001:db8::1' }],
    'broken.com': [{ type: 'CNAME', value: 'missing.com' }],
    'loop-a.com': [{ type: 'CNAME', value: 'loop-b.com' }],
    'loop-b.com': [{ type: 'CNAME', value: 'loop-a.com' }],
    'self.com': [{ type: 'CNAME', value: 'self.com' }],
    'entry.com': [{ type: 'CNAME', value: 'loop-a.com' }],
  };

  it('returns all A records', () => {
    assert.deepEqual(resolve('shop.com', zone), ['203.0.113.10', '203.0.113.11']);
  });

  it('follows a CNAME', () => {
    assert.deepEqual(resolve('www.shop.com', zone), ['203.0.113.10', '203.0.113.11']);
  });

  it('follows a chain of CNAMEs', () => {
    assert.deepEqual(resolve('m.shop.com', zone), ['203.0.113.10', '203.0.113.11']);
  });

  it('is case-insensitive and ignores a trailing dot', () => {
    assert.deepEqual(resolve('WWW.Shop.COM.', zone), ['203.0.113.10', '203.0.113.11']);
  });

  it('returns [] when the name exists but has no A records (NODATA)', () => {
    assert.deepEqual(resolve('ipv6only.com', zone), []);
  });

  it('returns null when the name does not exist (NXDOMAIN)', () => {
    assert.equal(resolve('nope.com', zone), null);
  });

  it('returns null when a CNAME points to a missing name', () => {
    assert.equal(resolve('broken.com', zone), null);
  });

  it('throws on a CNAME loop', () => {
    assert.throws(() => resolve('loop-a.com', zone));
    assert.throws(() => resolve('self.com', zone));
  });

  it('throws on a loop that does not include the starting name', () => {
    assert.throws(() => resolve('entry.com', zone));
  });

  it('does not modify the zone', () => {
    const before = JSON.stringify(zone);
    resolve('m.shop.com', zone);
    assert.equal(JSON.stringify(zone), before);
  });
});

describe('3) DnsCache', () => {
  function setup() {
    const clock = { t: 0 };
    const cache = new DnsCache(() => clock.t);
    return { clock, cache };
  }

  it('stores and returns a value', () => {
    const { cache } = setup();
    cache.set('example.com', ['203.0.113.10'], 300);
    assert.deepEqual(cache.get('example.com'), ['203.0.113.10']);
  });

  it('returns null for unknown names', () => {
    const { cache } = setup();
    assert.equal(cache.get('unknown.com'), null);
  });

  it('expires values after the TTL', () => {
    const { clock, cache } = setup();
    cache.set('example.com', ['203.0.113.10'], 300);
    clock.t = 299_999;
    assert.deepEqual(cache.get('example.com'), ['203.0.113.10']);
    clock.t = 300_000;
    assert.equal(cache.get('example.com'), null);
  });

  it('reports the remaining TTL in whole seconds', () => {
    const { clock, cache } = setup();
    cache.set('example.com', ['203.0.113.10'], 300);
    assert.equal(cache.ttlRemaining('example.com'), 300);
    clock.t = 100_000;
    assert.equal(cache.ttlRemaining('example.com'), 200);
    clock.t = 100_500;
    assert.equal(cache.ttlRemaining('example.com'), 199);
    clock.t = 400_000;
    assert.equal(cache.ttlRemaining('example.com'), 0);
    assert.equal(cache.ttlRemaining('unknown.com'), 0);
  });

  it('does not store anything when TTL is 0 or negative', () => {
    const { cache } = setup();
    cache.set('a.com', ['203.0.113.1'], 0);
    cache.set('b.com', ['203.0.113.2'], -5);
    assert.equal(cache.get('a.com'), null);
    assert.equal(cache.get('b.com'), null);
    assert.equal(cache.size, 0);
  });

  it('overwrites an existing entry and resets its TTL', () => {
    const { clock, cache } = setup();
    cache.set('example.com', ['203.0.113.10'], 60);
    clock.t = 50_000;
    cache.set('example.com', ['203.0.113.99'], 60);
    clock.t = 100_000;
    assert.deepEqual(cache.get('example.com'), ['203.0.113.99']);
  });

  it('is case-insensitive and ignores a trailing dot', () => {
    const { cache } = setup();
    cache.set('Example.COM.', ['203.0.113.10'], 300);
    assert.deepEqual(cache.get('example.com'), ['203.0.113.10']);
  });

  it('size counts only non-expired entries', () => {
    const { clock, cache } = setup();
    cache.set('short.com', ['203.0.113.1'], 10);
    cache.set('long.com', ['203.0.113.2'], 100);
    assert.equal(cache.size, 2);
    clock.t = 10_000;
    assert.equal(cache.size, 1);
    clock.t = 100_000;
    assert.equal(cache.size, 0);
  });

  it('caches falsy-looking values like an empty array (negative caching)', () => {
    const { cache } = setup();
    cache.set('ipv6only.com', [], 300);
    assert.deepEqual(cache.get('ipv6only.com'), []);
  });

  it('keeps separate caches independent', () => {
    const a = new DnsCache(() => 0);
    const b = new DnsCache(() => 0);
    a.set('example.com', ['203.0.113.10'], 300);
    assert.equal(b.get('example.com'), null);
  });
});
