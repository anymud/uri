import { URLSearchParams, URL } from 'url';


export type URLSearchParamsValue = string | number | boolean | null | undefined | Array<string | number | boolean | null | undefined>;
export type URLSearchParamsInput = URLSearchParams | Record<string, URLSearchParamsValue> | string;
export type URLInput = string | URL | { toString(): string };

/**
 * Convert a given input to a URL object, resolving against an optional base URL.
 * @param input The input to convert to a URL object.
 * @param base An optional base URL to resolve against.
 * @returns A new URL object.
 */
export function toURL(input: URLInput, base?: URLInput): URL {
  // Convert input or base to a string using toString if they are not already a string or URL.
  const inputURL = typeof input === 'string' || input instanceof URL ? input : input.toString();
  let baseURL: URL | string | undefined;

  if (base) {
    baseURL = typeof base === 'string' || base instanceof URL ? base : base.toString();
    // If base is provided, use it to resolve the input URL.
    return new URL(inputURL, baseURL);
  } else {
    // If no base is provided and input is a URL object or a valid URL string, return it directly.
    if (typeof inputURL === 'string') {
      try {
        return new URL(inputURL);
      } catch (error) {
        throw new Error(`Invalid URL: ${inputURL}`);
      }
    }
    // If input is already a URL object, just return it.
    return inputURL;
  }
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
 * Set the path of a URI.
 * 
 * @param url A given URI components object or URI string
 * @param path The new path to set
 * @returns A new uri components object with the path set to the given value
 */
export function setPath(url: URLInput, path: string): URL {
    const u = toURL(url);
    u.pathname = path;
    return u;
}


/**
 * Set the host of a URI.
 * @param url A given URI components object or URI string
 * @param host The new host to set
 * @returns A new uri components object with the host set to the given value
 */
export function setHost(url: URLInput, host: string): URL {
    const u = toURL(url);
    u.host = host;
    return u;
}


/**
 * Converts the given input to a URLSearchParams object.
 * @param search The input to convert
 * @returns A URLSearchParams object
 * @throws If the input type is not supported
 */
export function toURLSearchParams(search: URLSearchParamsInput): URLSearchParams {
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

export type QueryMergeMode = 'replace' | 'append';
/** 
 * Merge query parameters
 * @param query1 The first query string
 * @param query2 The second query string
 * @param mode The merge mode
 * @returns A new query string with the merged parameters
 */
export function mergeURLSearchParams(query1: URLSearchParamsInput, query2: URLSearchParamsInput, mode: QueryMergeMode = 'replace'): URLSearchParams {
    const q1 = toURLSearchParams(query1);
    const q2 = toURLSearchParams(query2);
    if (mode === 'replace') {
        q2.forEach((value, key) => q1.delete(key));
    }
    q2.forEach((value, key) => q1.append(key, value));
    return q1;
}