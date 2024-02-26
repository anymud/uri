import { describe, it, expect, test } from 'bun:test'
import { toString, type UriComponentsInput } from '~'

describe('toString function', () => {
  it('should correctly assemble a full URI', () => {
    const components: UriComponentsInput = {
      scheme: 'https',
      userInfo: {
        username: 'user',
        password: 'pass'
      },
      host: 'example.com',
      port: 8080,
      path: '/path/to/resource',
      query: 'key=value',
      fragment: 'section',
    };

    const expectedUri = 'https://user:pass@example.com:8080/path/to/resource?key=value#section';
    expect(toString(components)).toEqual(expectedUri);
  });

  it('should return a URN when isUrn is true', () => {
    const components: UriComponentsInput = {
      scheme: 'urn',
      path: 'isbn:0451450523',
      isUrn: true
    };

    const expectedUrn = 'urn:isbn:0451450523';
    expect(toString(components)).toEqual(expectedUrn);
  });

  it('should handle null components gracefully', () => {
    const components: UriComponentsInput = {};

    const expectedUri = '';
    expect(toString(components)).toEqual(expectedUri);
  });

  it('should omit password if username is present but password is null', () => {
    const components: UriComponentsInput = {
      scheme: 'http',
      userInfo: {
        username: 'user',
      },
      host: 'example.com',
      path: '/',
    };

    const expectedUri = 'http://user@example.com/';
    expect(toString(components)).toEqual(expectedUri);
  });

  it('should omit port if it is null', () => {
    const components: UriComponentsInput = {
      scheme: 'http',
      host: 'example.com',
      path: '/',
      query: 'query=string',
    };

    const expectedUri = 'http://example.com/?query=string';
    expect(toString(components)).toEqual(expectedUri);
  });
});
