import { describe, it, expect } from 'bun:test';
import { setSubdomain } from '~'; // Adjust the import path accordingly

// Example list of known TLDs for testing
const KnownTlds = ['com', 'org', 'net', 'co.uk'];

describe('setSubdomain function', () => {
  it('sets the subdomain for a URL without an existing subdomain', () => {
    const url = 'http://example.com';
    const newSubdomain = 'blog';
    const result = setSubdomain(url, newSubdomain, KnownTlds);
    expect(result.hostname).toBe('blog.example.com');
  });

  it('replaces an existing subdomain with a new one', () => {
    const url = 'http://sub.example.com';
    const newSubdomain = 'blog';
    const result = setSubdomain(url, newSubdomain, KnownTlds);
    expect(result.hostname).toBe('blog.example.com');
  });

  it('removes the subdomain when an empty string is provided', () => {
    const url = 'http://sub.example.com';
    const newSubdomain = '';
    const result = setSubdomain(url, newSubdomain, KnownTlds);
    expect(result.hostname).toBe('example.com');
  });

  it('correctly handles URLs with complex TLDs', () => {
    const url = 'http://sub.example.co.uk';
    const newSubdomain = 'blog';
    const result = setSubdomain(url, newSubdomain, KnownTlds);
    expect(result.hostname).toBe('blog.example.co.uk');
  });

  it('throws an error for URLs without a recognized TLD', () => {
    const url = 'http://example.unknown';
    const newSubdomain = 'blog';
    const testFn = () => setSubdomain(url, newSubdomain, KnownTlds);
    expect(testFn).toThrow('Top-level domain not found in the host.');
  });

  // Consider adding tests for input types other than string, if your toURL function supports it
  // For example, testing with a URL object as input
  it('works with URL object input', () => {
    const url = new URL('http://sub.example.com');
    const newSubdomain = 'blog';
    const result = setSubdomain(url, newSubdomain, KnownTlds);
    expect(result.hostname).toBe('blog.example.com');
  });

  // Add more tests as needed to cover additional edge cases or scenarios
});