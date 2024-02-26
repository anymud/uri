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
