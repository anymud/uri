import { getSubdomain } from '~'; // Adjust the import path to where your function is defined
import { describe, it, expect } from 'bun:test';

// Mock known TLDs for testing purposes
const mockKnownTlds = ['com', 'org', 'net'];

describe('getSubdomain function', () => {

  it('should extract the subdomain from a simple URI string', () => {
    const uri = 'http://subdomain.example.com';
    const expected = 'subdomain';
    const result = getSubdomain(uri, mockKnownTlds);
    expect(result).toBe(expected);
  });

  it('should handle complex URI with multiple subdomains', () => {
    const uri = 'http://a.b.subdomain.example.com';
    const expected = 'a.b.subdomain';
    const result = getSubdomain(uri, mockKnownTlds);
    expect(result).toBe(expected);
  });

  it('should return an empty string if no subdomain is present', () => {
    const uri = 'http://example.com';
    const expected = '';
    const result = getSubdomain(uri, mockKnownTlds);
    expect(result).toBe(expected);
  });

  it('should process URI components object with subdomain', () => {
    const uriComponents = {
      scheme: 'http',
      authority: 'subdomain.example.com',
      host: 'subdomain.example.com'
    };
    const expected = 'subdomain';
    const result = getSubdomain(uriComponents, mockKnownTlds);
    expect(result).toBe(expected);
  });

  it('should return empty string for URI components object without subdomain', () => {
    const uriComponents = {
      scheme: 'http',
      authority: 'example.com',
      host: 'example.com'
    };
    const expected = '';
    const result = getSubdomain(uriComponents, mockKnownTlds);
    expect(result).toBe(expected);
  });

  // Add more tests as needed to cover edge cases, different schemes, ports, etc.
});