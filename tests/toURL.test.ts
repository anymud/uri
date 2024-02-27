import { describe, it, expect } from 'bun:test';
import { toURL, type URLInput } from '~'; // Update the import path

describe('toURL function', () => {
  it('converts a string representing an absolute URL to a URL object', () => {
    const input = 'https://example.com/path?query=123';
    const result = toURL(input);
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe(input);
  });

  it('converts a URL object to the same URL object', () => {
    const input = new URL('https://example.com/path?query=123');
    const result = toURL(input);
    expect(result).toBe(input);
  });

  it('converts an object with toString method to a URL object', () => {
    const input = { toString: () => 'https://example.com/path?query=123' };
    const result = toURL(input);
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe(input.toString());
  });

  it('returns a new URL instance when input is a valid URL object using hostname and protocol', () => {
    const input = {
      protocol: 'https:',
      hostname: 'example.com',
      pathname: '/path',
      search: '?param=123',
      port: '8080',
    };
    const result = toURL(input);
    expect(result instanceof URL).toBe(true);
    expect(result.protocol).toBe('https:');
    expect(result.hostname).toBe('example.com');
    expect(result.pathname).toBe('/path');
    expect(result.search).toBe('?param=123');
    expect(result.port).toBe('8080');
  });
  
  it('returns a new URL instance when input is a valid URL object using host and protocol', () => {
    const input = {
      protocol: 'https:',
      host: 'example.com',
      pathname: '/path',
      search: '?param=123',
      port: '8080',
    };
    const result = toURL(input);
    expect(result instanceof URL).toBe(true);
    expect(result.protocol).toBe('https:');
    expect(result.hostname).toBe('example.com');
    expect(result.pathname).toBe('/path');
    expect(result.search).toBe('?param=123');
    expect(result.port).toBe('8080');
  });
  
  it('handles a URL object with a missing hostname or host by throwing an error', () => {
    const input = {
      protocol: 'https:',
    };
    expect(() => toURL(input)).toThrow('Invalid URL');
  });
  
  
  it('handles a URL object with a missing protocol by throwing an error', () => {
    const input = {
      host: 'https:',
    };
    expect(() => toURL(input)).toThrow('Invalid URL');
  });  

  it('resolves a relative URL against a base string URL', () => {
    const input = '/path?query=123';
    const base = 'https://example.com';
    const result = toURL(input, base);
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe(`${base}${input}`);
  });

  it('resolves a relative URL against a base URL object', () => {
    const input = '/path?query=123';
    const base = new URL('https://example.com');
    const result = toURL(input, base);
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe("https://example.com/path?query=123");
  });

  it('throws an error for invalid URL strings without a base', () => {
    const input = 'not-a-valid-url';
    expect(() => toURL(input)).toThrow('Invalid URL');
  });

  it('handles an object with toString returning an invalid URL by throwing an error', () => {
    const input = { toString: () => 'not-a-valid-url' };
    expect(() => toURL(input)).toThrow('Invalid URL');
  });
});
