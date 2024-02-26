import { describe, it, expect, test } from 'bun:test'
import { parseUri } from '~'

describe('parseUri', () => {
    test('parses a URI with only scheme correctly', () => {
        const uri = 'http:';
        const expected = {
            scheme: 'http',
            isUrn: false
        };
        expect(parseUri(uri)).toEqual(expected);
    });

    test('parses a URI with scheme and path correctly', () => {
        const uri = 'http:/path/to/resource';
        const expected = {
            scheme: 'http',
            path: '/path/to/resource',
            isUrn: false
        };
        expect(parseUri(uri)).toEqual(expected);
    });

    test('parses a full URI with userInfo correctly', () => {
        const uri = 'http://user:pass@host:8080/path?query=123#fragment';
        const expected = {
            scheme: 'http',
            authority: 'user:pass@host:8080',
            userInfo: {
                username: 'user',
                password: 'pass'
            },
            host: 'host',
            port: 8080,
            path: '/path',
            query: 'query=123',
            fragment: 'fragment',
            isUrn: false
        };
        expect(parseUri(uri)).toEqual(expected);
    });

    test('parses a URI without userInfo correctly', () => {
        const uri = 'http://host:8080/path?query=123#fragment';
        const expected = {
            scheme: 'http',
            authority: 'host:8080',
            host: 'host',
            port: 8080,
            path: '/path',
            query: 'query=123',
            fragment: 'fragment',
            isUrn: false  
        };
        expect(parseUri(uri)).toEqual(expected);
    });

    test('parses a URI with default port correctly', () => {
        const uri = 'http://host/path?query=123#fragment';
        const expected = {
            scheme: 'http',
            authority: 'host',
            host: 'host',
            path: '/path',
            query: 'query=123',
            fragment: 'fragment',
            isUrn: false  
        };
        expect(parseUri(uri)).toEqual(expected);
    });

    test('parses a URN correctly', () => {
        const uri = 'urn:isbn:0451450523';
        const expected = {
            scheme: 'urn',
            path: 'isbn:0451450523',
            isUrn: true
        };
        expect(parseUri(uri)).toEqual(expected);
    });

    test('parses a URI with IPv6 address correctly', () => {
        const uri = 'http://[::1]:8080/path';
        const expected = {
            scheme: 'http',
            authority: '[::1]:8080',
            host: '::1',
            port: 8080,
            path: '/path',
            isUrn: false
        };
        expect(parseUri(uri)).toEqual(expected);
    });

    // test('handles invalid URIs by throwing an error', () => {
    //     const uri = '://shouldfail';
    //     expect(() => parseUri(uri)).toThrow('Invalid URI');
    // });
});
