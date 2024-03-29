import { URLSearchParams, URL } from 'url';

export interface URLParams {
    hostname: string;
    pathname: string;
    search: string;
    host: string;
    href: string;
    password: string;
    port: string;
    protocol: string;
    username: string;
}

export type URLSearchValue = string | number | boolean | null | undefined | Array<string | number | boolean | null | undefined>;
export type URLSearchInput = URLSearchParams | Record<string, URLSearchValue> | string;
export type URLInput = string | URL | { toString(): string } | Partial<URLParams> & ({ protocol: string, host: string } | { protocol: string, hostname: string });


/**
 * Converts the input into a URL object.
 * 
 * @param input - The input to convert into a URL. It can be a URL object, a string, or an object with URL properties.
 * @param base - The base URL to resolve relative URLs against.
 * @returns The converted URL object.
 * @throws Error if the input is not a valid URL.
 */
export function toURL(input: URLInput, base?: URLInput): URL {
    if (input instanceof URL) {
        return input;
    }
    
    if (typeof input === 'object' && ('protocol' in input && ('host' in input || 'hostname' in input))) {
        const { hostname, pathname, search, host, href, password, port, protocol, username } = input;
        const url = new URL('http://localhost', base ? toURL(base) : undefined);
        if (protocol) url.protocol = protocol;
        else throw new Error('Invalid URL');
        if (hostname) url.hostname = hostname;
        else if (host) url.host = host;
        else throw new Error('Invalid URL');
        if (pathname) url.pathname = pathname;
        if (search) url.search = search;
        if (href) url.href = href;
        if (password) url.password = password;
        if (port) url.port = port;
        if (username) url.username = username;
        return url;
    }
    
    if (typeof input === 'string' || (typeof input === 'object' && typeof input.toString === 'function')) {
        try {
            return new URL(input, base ? toURL(base) : undefined);
        } catch (e) {
            throw new Error('Invalid URL');
        }
    }
    
    throw new Error('Invalid URL');
}


const KnownTlds = [
    'com', 'org', 'net', 'int', 'edu', 'gov', 'mil', 
    'co.uk', 'org.uk', 'gov.uk', 'ltd.uk', 'plc.uk', 
    'me.uk', 'com.au', 'net.au', 'org.au', 'de', 'ca',
    'us', 'eu', 'es', 'it', 'fr', 'nl', 'be', 'at', 'dk',
    'ch', 'se', 'no', 'fi', 'jp', 'cn', 'in', 'ru', 'br',
    'au', 'info', 'name', 'io', 'xxx', 'id', 'me', 'mobi',
    'cc', 'ws', 'fm', 'tv', 'tk', 'nu', 'jp', 'cn', 'in',
    'ru', 'br', 'au', 'info', 'name', 'io', 'xxx', 'id',
    'me', 'mobi'
  ];

/**
 * Extracts the subdomain from the host component of a URI.
 * @param url A url components object.
 * @returns The subdomain extracted from the host component.
 */
export function getSubdomain(url: URLInput, tlds: string[] = KnownTlds): string {
    const urlObj = toURL(url);
    
    // Extract the current host and split into parts
    const hostParts = urlObj.hostname.split('.');
    
    // Identify the TLD and SLD (second-level domain)
    let domainPartsCount = 0;
    for (let i = hostParts.length - 1; i >= 0; i--) {
        const part = hostParts.slice(i).join('.');
        if (tlds.includes(part)) {
            domainPartsCount = hostParts.length - i;
            break;
        }
    }
    
    if (domainPartsCount === 0) {
        throw new Error('Top-level domain not found in the host.');
    }
    
    // Extract the subdomain
    return hostParts.slice(0, hostParts.length - domainPartsCount - 1).join('.');
}


/**
 * set the subdomain of a URI.
 * @param url A given URI components object or URI string
 * @param subdomain The new subdomain to set
 * @param tlds The list of known top-level domains
 * @returns the input URI with the subdomain set to the given value
 */
export function setSubdomain(url: URLInput, subdomain: string, tlds: string[] = KnownTlds): URL {
  const urlObj = toURL(url);
  const hostParts = urlObj.hostname.split('.');
  let domainPartsCount = 0;
  for (let i = hostParts.length - 1; i >= 0; i--) {
      const part = hostParts.slice(i).join('.');
      if (tlds.includes(part)) {
          domainPartsCount = hostParts.length - i;
          break;
      }
  }
  if (domainPartsCount === 0) {
      throw new Error('Top-level domain not found in the host.');
  }
  if (subdomain !== '') {
    hostParts.splice(0, hostParts.length - domainPartsCount - 1, subdomain);
  } else {
    // If the subdomain is an empty string, remove it from the host.
    hostParts.splice(0, hostParts.length - domainPartsCount - 1);
  }
  urlObj.hostname = hostParts.join('.');
  return urlObj;
}


/**
 * Converts the given input to a URLSearchParams object.
 * @param search The input to convert
 * @returns A URLSearchParams object
 * @throws If the input type is not supported
 */
export function toURLSearchParams(search: URLSearchInput): URLSearchParams {
  // Directly return the input if it's already a URLSearchParams object.
  if (search instanceof URLSearchParams) {
    return search;
  }
  
  // If the input is a string, use it to construct a new URLSearchParams object.
  if (typeof search === 'string') {
    return new URLSearchParams(search);
  }
  
  // If the input is a record/object, convert it to URLSearchParams.
  if (typeof search === 'object') {
    const params = new URLSearchParams();
    
    Object.entries(search).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // If the value is an array, append each value under the same key.
        value.forEach(val => {
          if (val !== null && val !== undefined) {
            params.append(key, String(val));
          }
        });
      } else {
        // For non-array values, append them directly if they're not null/undefined.
        if (value !== null && value !== undefined) {
          params.append(key, String(value));
        }
      }
    });
    
    return params;
  }

  // Throw an error if the input type is not supported.
  throw new Error('Unsupported search params input type.');
}

/**
 * Represents the merge mode for query parameters.
 * - 'replace': Replaces the existing query parameters with the new ones.
 * - 'append': Appends the new query parameters to the existing ones.
 */
export type QueryMergeMode = 'replace' | 'append';

/**
 * Merges two URL search parameters objects into a single URLSearchParams object.
 * @param query1 - The first URL search parameters object.
 * @param query2 - The second URL search parameters object.
 * @param mode - The merge mode. Defaults to 'replace'.
 * @returns The merged URLSearchParams object.
 */
export function mergeURLSearchParams(query1: URLSearchInput, query2: URLSearchInput, mode: QueryMergeMode = 'replace'): URLSearchParams {
    const q1 = toURLSearchParams(query1);
    const q2 = toURLSearchParams(query2);
    for (const [key, value] of q2) {
        if (mode === 'replace') {
          q1.set(key, value);
        } else {
          q1.append(key, value);
        }
    }
    return q1;
}


/**
 * Merges the search parameters of a URL with the provided search parameters.
 * @param url - The URL to merge the search parameters into.
 * @param search - The search parameters to merge into the URL.
 * @param mode - The merge mode. Defaults to 'replace'.
 * @returns The URL with the merged search parameters.
 */
export function mergeSearch(url: URLInput, search: URLSearchInput, mode: QueryMergeMode = 'replace'): URL {
    const u = toURL(url);
    u.search = mergeURLSearchParams(u.search, search, mode).toString();
    return u;
}

/**
 * Set the given path to the URL's pathname.
 * 
 * @param url - The URL to modify.
 * @param path - The path to apply to the URL's pathname.
 * @returns A new URL object with the modified pathname.
 */
export function setPathname(url: URLInput, path: string): URL {
  const u = toURL(url);
  u.pathname = path;
  return u;
}


/**
 * Set the specified host to the given URL.
 * @param url - The URL to modify.
 * @param host - The new host value to set.
 * @returns The modified URL with the updated host.
 */
export function setHost(url: URLInput, host: string): URL {
  const u = toURL(url);
  u.host = host;
  return u;
}

