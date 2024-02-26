import { describe, it, expect } from 'bun:test';
import { resolveUri } from '~'; // Adjust the import path accordingly

describe('resolveUri', () => {
  it('should correctly resolve a relative path to a base URI', () => {
    const baseComponents = { scheme: 'http', host: 'example.com', path: '/base/' };
    const relativeComponents = { path: 'relative/path' };
    const expected = { scheme: 'http', host: 'example.com', path: '/base/relative/path', isUrn: false };
    expect(resolveUri(baseComponents, relativeComponents)).toEqual(expected);
  });

  it('should override the base path if the relative path starts with a slash', () => {
    const baseComponents = { scheme: 'http', host: 'example.com', path: '/base/' };
    const relativeComponents = { path: '/new/path' };
    const expected = { scheme: 'http', host: 'example.com', path: '/new/path', isUrn: false };
    expect(resolveUri(baseComponents, relativeComponents)).toEqual(expected);
  });

  it('should correctly resolve a relative scheme and host', () => {
    const baseComponents = { scheme: 'http', host: 'example.com', path: '/base/' };
    const relativeComponents = { scheme: 'https', host: 'another.com' };
    const expected = { scheme: 'https', host: 'another.com', path: '/base/', isUrn: false };
    expect(resolveUri(baseComponents, relativeComponents)).toEqual(expected);
  });

  it('should handle query parameters and fragments', () => {
    const baseComponents = { scheme: 'http', host: 'example.com', path: '/base/', query: 'id=123', fragment: 'section' };
    const relativeComponents = { path: 'path', query: 'key=value', fragment: 'subsection' };
    const expected = { scheme: 'http', host: 'example.com', path: '/base/path', query: 'key=value', fragment: 'subsection', isUrn: false };
    expect(resolveUri(baseComponents, relativeComponents)).toEqual(expected);
  });

  it('should return the relative components if base components are empty', () => {
    const baseComponents = {};
    const relativeComponents = { scheme: 'https', host: 'another.com', path: '/new/path', query: 'key=value', fragment: 'subsection' };
    const expected = { scheme: 'https', host: 'another.com', path: '/new/path', query: 'key=value', fragment: 'subsection', isUrn: false };
    expect(resolveUri(baseComponents, relativeComponents)).toEqual(expected);
  });

  it('should correctly handle empty relative components', () => {
    const baseComponents = { scheme: 'http', host: 'example.com', path: '/base/path' };
    const relativeComponents = {};
    const expected = { scheme: 'http', host: 'example.com', path: '/base/path', isUrn: false };
    expect(resolveUri(baseComponents, relativeComponents)).toEqual(expected);
  });

  // Add more test cases as needed to cover additional scenarios and edge cases
});