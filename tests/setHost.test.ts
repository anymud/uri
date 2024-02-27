import { describe, it, expect } from 'bun:test';
import { setHost } from '../src/index';

describe('applyHost function', () => {
  it('changes the host of an absolute URL', () => {
    const url = 'https://example.com/path?query=123';
    const host = 'newhost.com';
    const result = setHost(url, host);
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe('https://newhost.com/path?query=123');
  });

  it('changes the host of a URL object', () => {
    const url = new URL('https://example.com/path?query=123');
    const host = 'newhost.com';
    const result = setHost(url, host);
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe('https://newhost.com/path?query=123');
  });

  it('changes the host of an object with toString method', () => {
    const url = { toString: () => 'https://example.com/path?query=123' };
    const host = 'newhost.com';
    const result = setHost(url, host);
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe('https://newhost.com/path?query=123');
  });

  it('throws an error for invalid URL strings', () => {
    const url = 'not-a-valid-url';
    const host = 'newhost.com';
    expect(() => setHost(url, host)).toThrow('Invalid URL');
  });

  it('throws an error for objects with toString returning an invalid URL', () => {
    const url = { toString: () => 'not-a-valid-url' };
    const host = 'newhost.com';
    expect(() => setHost(url, host)).toThrow('Invalid URL');
  });
});