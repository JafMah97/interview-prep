import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isValidIPv4, isPrivateIPv4, getDefaultPort } from './01-ip-and-ports.js';

describe('isValidIPv4', () => {
  it('accepts valid addresses', () => {
    assert.equal(isValidIPv4('192.168.1.1'), true);
    assert.equal(isValidIPv4('8.8.8.8'), true);
    assert.equal(isValidIPv4('0.0.0.0'), true);
    assert.equal(isValidIPv4('255.255.255.255'), true);
    assert.equal(isValidIPv4('127.0.0.1'), true);
  });

  it('rejects numbers out of range', () => {
    assert.equal(isValidIPv4('256.1.1.1'), false);
    assert.equal(isValidIPv4('1.1.1.300'), false);
    assert.equal(isValidIPv4('-1.1.1.1'), false);
  });

  it('rejects wrong number of parts', () => {
    assert.equal(isValidIPv4('192.168.1'), false);
    assert.equal(isValidIPv4('1.2.3.4.5'), false);
    assert.equal(isValidIPv4(''), false);
  });

  it('rejects empty parts', () => {
    assert.equal(isValidIPv4('1.2.3.4.'), false);
    assert.equal(isValidIPv4('.1.2.3'), false);
    assert.equal(isValidIPv4('1..2.3'), false);
  });

  it('rejects leading zeros', () => {
    assert.equal(isValidIPv4('192.168.01.1'), false);
    assert.equal(isValidIPv4('00.0.0.0'), false);
  });

  it('rejects non-digit characters (tricky ones!)', () => {
    assert.equal(isValidIPv4('1.2.3.a'), false);
    assert.equal(isValidIPv4('1.2.3. 4'), false);
    assert.equal(isValidIPv4('1e2.1.1.1'), false);
    assert.equal(isValidIPv4('0x1.1.1.1'), false);
    assert.equal(isValidIPv4('+1.1.1.1'), false);
  });
});

describe('isPrivateIPv4', () => {
  it('detects 10.x.x.x', () => {
    assert.equal(isPrivateIPv4('10.0.0.1'), true);
    assert.equal(isPrivateIPv4('10.255.255.255'), true);
  });

  it('detects 172.16.x.x to 172.31.x.x only', () => {
    assert.equal(isPrivateIPv4('172.16.0.0'), true);
    assert.equal(isPrivateIPv4('172.20.5.5'), true);
    assert.equal(isPrivateIPv4('172.31.255.255'), true);
    assert.equal(isPrivateIPv4('172.15.0.1'), false);
    assert.equal(isPrivateIPv4('172.32.0.1'), false);
  });

  it('detects 192.168.x.x only', () => {
    assert.equal(isPrivateIPv4('192.168.1.10'), true);
    assert.equal(isPrivateIPv4('192.169.1.1'), false);
  });

  it('returns false for public addresses', () => {
    assert.equal(isPrivateIPv4('8.8.8.8'), false);
    assert.equal(isPrivateIPv4('142.250.185.78'), false);
  });

  it('returns false for loopback (it is not private)', () => {
    assert.equal(isPrivateIPv4('127.0.0.1'), false);
  });

  it('returns false for invalid addresses', () => {
    assert.equal(isPrivateIPv4('10.0.0.256'), false);
    assert.equal(isPrivateIPv4('192.168.1'), false);
  });
});

describe('getDefaultPort', () => {
  it('returns known ports', () => {
    assert.equal(getDefaultPort('http'), 80);
    assert.equal(getDefaultPort('https'), 443);
    assert.equal(getDefaultPort('ws'), 80);
    assert.equal(getDefaultPort('wss'), 443);
    assert.equal(getDefaultPort('ftp'), 21);
    assert.equal(getDefaultPort('ssh'), 22);
  });

  it('handles trailing colon', () => {
    assert.equal(getDefaultPort('https:'), 443);
  });

  it('is case-insensitive', () => {
    assert.equal(getDefaultPort('HTTP'), 80);
    assert.equal(getDefaultPort('Https:'), 443);
  });

  it('returns null for unknown protocols', () => {
    assert.equal(getDefaultPort('gopher'), null);
    assert.equal(getDefaultPort(''), null);
  });

  it('does not leak Object.prototype keys', () => {
    assert.equal(getDefaultPort('constructor'), null);
    assert.equal(getDefaultPort('toString'), null);
  });
});
