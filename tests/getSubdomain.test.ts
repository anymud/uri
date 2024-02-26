import { describe, it, expect } from 'bun:test';
import { getSubdomain } from '~'; // Update the import path

// Example list of known TLDs for testing
const KnownTlds = ['com', 'org', 'net', 'co.uk'];

describe('getSubdomain function', () => {
  it('extracts subdomain from a URL with a common TLD', () => {
    const url = 'http://sub.example.com';
    const subdomain = getSubdomain(url, KnownTlds);
    expect(subdomain).toBe('sub');
  });

  it('returns an empty string when URL has no subdomain', () => {
    const url = 'http://example.com';
    const subdomain = getSubdomain(url, KnownTlds);
    expect(subdomain).toBe('');
  });

  it('correctly identifies subdomains with a complex TLD', () => {
    const url = 'http://sub.example.co.uk';
    const subdomain = getSubdomain(url, KnownTlds);
    expect(subdomain).toBe('sub');
  });

  it('handles URLs with multiple subdomain levels', () => {
    const url = 'http://a.b.c.example.com';
    const subdomain = getSubdomain(url, KnownTlds);
    expect(subdomain).toBe('a.b.c');
  });

  it('throws an error for URLs without a recognized TLD', () => {
    const url = 'http://example.unknown';
    const testFn = () => getSubdomain(url, KnownTlds);
    expect(testFn).toThrow('Top-level domain not found in the host.');
  });

  // Testing with URLInput types other than string, like URL object
  it('works with URL object input', () => {
    const url = new URL('http://sub.example.com');
    const subdomain = getSubdomain(url, KnownTlds);
    expect(subdomain).toBe('sub');
  });

  // Add more tests as needed to cover additional edge cases or scenarios
});