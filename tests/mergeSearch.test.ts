import { describe, it, expect } from 'bun:test';
import { mergeSearch } from '../src/index';

describe('mergeSearch function', () => {
  it('replaces the search params of an absolute URL', () => {
    const url = 'https://example.com/path?param=123';
    const search = { param: '456' };
    const result = mergeSearch(url, search);
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe('https://example.com/path?param=456');
  });

  it('replaces the search params of a URL object', () => {
    const url = new URL('https://example.com/path?param=123');
    const search = { param: '456' };
    const result = mergeSearch(url, search);
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe('https://example.com/path?param=456');
  });

  it('replaces the search params of an object with toString method', () => {
    const url = { toString: () => 'https://example.com/path?param=123' };
    const search = { param: '456' };
    const result = mergeSearch(url, search);
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe('https://example.com/path?param=456');
  });

  it('merges the search params of an absolute URL', () => {
    const url = 'https://example.com/path?param=123';
    const search = { param: '456' };
    const result = mergeSearch(url, search, 'append');
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe('https://example.com/path?param=123&param=456');
  });

  it('merges the search params of a URL object', () => {
    const url = new URL('https://example.com/path?param=123');
    const search = { param: '456' };
    const result = mergeSearch(url, search, 'append');
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe('https://example.com/path?param=123&param=456');
  });

  it('merges the search params of an object with toString method', () => {
    const url = { toString: () => 'https://example.com/path?param=123' };
    const search = { param: '456' };
    const result = mergeSearch(url, search, 'append');
    expect(result instanceof URL).toBe(true);
    expect(result.href).toBe('https://example.com/path?param=123&param=456');
  });
});