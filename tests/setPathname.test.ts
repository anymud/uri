import { describe, it, expect } from 'bun:test';
import { setPathname } from '../src/index';

describe('applyPathname function', () => {
  it('changes the pathname of an absolute URL', () => {
    const url = 'https://example.com/path?query=123';
    const path = '/newpath';
    const result = setPathname(url, path);
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe('https://example.com/newpath?query=123');
  });

  it('changes the pathname of a URL object', () => {
    const url = new URL('https://example.com/path?query=123');
    const path = '/newpath';
    const result = setPathname(url, path);
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe('https://example.com/newpath?query=123');
  });

  it('changes the pathname of an object with toString method', () => {
    const url = { toString: () => 'https://example.com/path?query=123' };
    const path = '/newpath';
    const result = setPathname(url, path);
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe('https://example.com/newpath?query=123');
  });

  it('throws an error for invalid URL strings', () => {
    const url = 'not-a-valid-url';
    const path = '/newpath';
    expect(() => setPathname(url, path)).toThrow('Invalid URL');
  });

  it('throws an error for objects with toString returning an invalid URL', () => {
    const url = { toString: () => 'not-a-valid-url' };
    const path = '/newpath';
    expect(() => setPathname(url, path)).toThrow('Invalid URL');
  });
});