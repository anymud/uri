import { setSubdomain } from '~'; // Adjust the import path to where your function is defined
import { describe, it, expect } from 'bun:test';

describe('setSubdomain function', () => {
  it('should set the subdomain for a URI components object without an existing subdomain', () => {
    const components = {
      scheme: 'https',
      host: 'example.com'
    };
    const subdomain = 'blog';
    const expected = {
      ...components,
      host: 'blog.example.com',
      isUrn: false,
    };
    const result = setSubdomain(components, subdomain);
    expect(result).toEqual(expected);
  });

  it('should replace the subdomain for a URI components object with an existing subdomain', () => {
    const components = {
      scheme: 'https',
      host: 'blog.example.com'
    };
    const subdomain = 'news';
    const expected = {
      ...components,
      host: 'news.example.com',
      isUrn: false,
    };
    const result = setSubdomain(components, subdomain);
    expect(result).toEqual(expected);
  });

  it('should remove the subdomain if an empty string is provided', () => {
    const components = {
      scheme: 'https',
      host: 'blog.example.com'
    };
    const subdomain = '';
    const expected = {
      ...components,
      host: 'example.com',
      isUrn: false,
    };
    const result = setSubdomain(components, subdomain);
    expect(result).toEqual(expected);
  });

  it('should correctly handle complex subdomains', () => {
    const components = {
      scheme: 'https',
      host: 'a.b.example.com'
    };
    const subdomain = 'c.d';
    const expected = {
      ...components,
      host: 'c.d.example.com',
      isUrn: false,
    };
    const result = setSubdomain(components, subdomain);
    expect(result).toEqual(expected);
  });

  // Add more tests as needed for edge cases, like handling of ports, paths, queries, fragments, etc.
});
