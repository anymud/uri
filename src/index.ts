/**
 * A URI components object.
 */
export interface UriComponents {
  scheme?: string;
  authority?: string;
  userInfo?: {
      username?: string;
      password?: string;
  };
  host?: string;
  port?: number;
  path?: string;
  query?: string;
  fragment?: string;
  isUrn: boolean;
}

export type UriComponentsInput = Omit<UriComponents, 'isUrn'> & { isUrn?: boolean } | string


/**
 * Parses a URI string into its components.
 * @param uri A URI string to parse
 * @returns A URI components object representing the given URI.
 */
export function parseUri(uri: string): UriComponents {
  const regex = /^(?:([^:/?#]+):)?(?:(\/\/)([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/;
  const matches = regex.exec(uri);

  if (!matches) {
      throw new Error('Invalid URI');
  }

  const scheme = matches[1] || undefined;
  let authority = matches[3] || undefined;
  let userInfo = undefined;
  let host = undefined;
  let port: number | undefined = undefined;

  if (authority) {
      const ipv6Regex = /^\[([^\]]+)](?:\:(\d+))?$/;
      const ipv6Match = authority.match(ipv6Regex);

      if (ipv6Match) {
          host = ipv6Match[1];
          port = ipv6Match[2] ? parseInt(ipv6Match[2], 10) : undefined;
      } else {
          const [userPart, hostPart] = authority.split('@');
          const hostPort = hostPart ? hostPart.split(':') : userPart.split(':');
          if (hostPart) {
              userInfo = {
                  username: userPart.split(':')[0] || undefined,
                  password: userPart.split(':')[1] || undefined,
              };
          }

          host = hostPort[0];
          port = hostPort[1] ? parseInt(hostPort[1], 10) : undefined;
      }
  }

  return {
      scheme,
      authority,
      userInfo,
      host,
      port,
      path: matches[4] || undefined,
      query: matches[5] || undefined,
      fragment: matches[6] || undefined,
      isUrn: scheme?.toLowerCase() === 'urn'
  };
}


/**
 * Converts a URI components object to a URI string.
 * @param components A uri components object or uri string
 * @returns A string representation of the given URI components.
 */
function resolveUriComponents(components: UriComponentsInput) : UriComponents {
  if (typeof components === 'string') {
    return parseUri(components);
  }
  return {
      scheme: components.scheme,
      authority: components.authority,
      userInfo: components.userInfo,
      host: components.host,
      port: components.port,
      path: components.path,
      query: components.query,
      fragment: components.fragment,
      isUrn: components.isUrn ?? false
  };
}

/**
 * Converts a URI components object to a URI string.
 * @param components A uri components object or uri string
 * @returns A string representation of the given URI components.
 */
export function toString(components: UriComponentsInput): string {
  components = resolveUriComponents(components);
  let uri = '';

  // Append scheme
  if (components.scheme) {
      uri += components.scheme + ':';
  }

  if (components.isUrn) {
      // For URN, directly append the path without a slash
      uri += components.path;
  } else {
      // Handle URLs
      // Append authority if there's a host
      if (components.host) {
          uri += '//';

          // Append userInfo if present
          if (components.userInfo) {
              if (components.userInfo.username) {
                  uri += components.userInfo.username;
                  if (components.userInfo.password) {
                      uri += ':' + components.userInfo.password;
                  }
              }
              uri += '@';
          }

          // Handle IPv6 address by wrapping it in square brackets
          if (components.host.includes(':')) { // Simple check for IPv6
              uri += '[' + components.host + ']';
          } else {
              uri += components.host;
          }

          // Append port if present
          if (components.port !== undefined) {
              uri += ':' + components.port;
          }
      }

      // Append path
      if (components.path) {
          // Ensure there's a slash between the authority (or scheme if authority is absent) and the path
          if (uri && !uri.endsWith('/') && !components.path.startsWith('/')) {
              uri += '/';
          }
          uri += components.path;
      }
  }

  // Append query if present
  if (components.query) {
      uri += '?' + components.query;
  }

  // Append fragment if present
  if (components.fragment) {
      uri += '#' + components.fragment;
  }

  return uri;
}

/**
 * Resolves a relative URI against a base URI.
 * @param baseComponents A uri components object or uri string
 * @param relativeComponents A uri components object or uri string
 * @returns A new uri components object with the relative URI resolved against the base URI.
 */
export function resolveUri(baseComponents: UriComponentsInput, relativeComponents: UriComponentsInput): UriComponents {
  baseComponents = resolveUriComponents(baseComponents);
  relativeComponents = resolveUriComponents(relativeComponents);
  let resultComponents: UriComponents = { isUrn: false };

  if (relativeComponents.scheme !== undefined) {
      resultComponents.scheme = relativeComponents.scheme;
      resultComponents.authority = relativeComponents.authority;
      resultComponents.userInfo = relativeComponents.userInfo;
      resultComponents.host = relativeComponents.host;
      resultComponents.port = relativeComponents.port;
      resultComponents.path = removeDotSegments(relativeComponents.path ?? '');
      resultComponents.query = relativeComponents.query;
  } else {
      resultComponents.scheme = baseComponents.scheme;

      if (relativeComponents.authority !== undefined) {
          resultComponents.authority = relativeComponents.authority;
          resultComponents.userInfo = relativeComponents.userInfo;
          resultComponents.host = relativeComponents.host;
          resultComponents.port = relativeComponents.port;
          resultComponents.path = removeDotSegments(relativeComponents.path ?? '');
          resultComponents.query = relativeComponents.query;
      } else {
          resultComponents.userInfo = baseComponents.userInfo;
          resultComponents.host = baseComponents.host;
          resultComponents.port = baseComponents.port;

          if (relativeComponents.path === undefined || relativeComponents.path === '') {
              resultComponents.path = baseComponents.path;

              if (relativeComponents.query !== undefined) {
                  resultComponents.query = relativeComponents.query;
              } else {
                  resultComponents.query = baseComponents.query;
              }
          } else {
              if (relativeComponents.path.startsWith('/')) {
                  resultComponents.path = removeDotSegments(relativeComponents.path);
              } else {
                  if (baseComponents.path !== undefined) {
                      const basePath = baseComponents.path.substring(0, baseComponents.path.lastIndexOf('/') + 1);
                      resultComponents.path = removeDotSegments(basePath + relativeComponents.path);
                  } else {
                      resultComponents.path = relativeComponents.path;
                  }
              }
              resultComponents.query = relativeComponents.query;
          }
      }
  }

  if (relativeComponents.fragment !== undefined) {
      resultComponents.fragment = relativeComponents.fragment;
  }

  return resultComponents;
}


function removeDotSegments(path: string | undefined): string {
  if (!path) return '';
  let result = '';
  while (path.length) {
      if (path.startsWith('../') || path.startsWith('./')) {
          path = path.replace(/^\.+\//, '');
      } else if (path.startsWith('/./')) {
          path = path.replace(/^\/\.\//, '/');
      } else if (path === '/.') {
          path = '/';
      } else if (path.startsWith('/../') || path === '/..') {
          path = path.replace(/^\/\.\.\//, '/');
          result = result.replace(/\/?[^\/]*$/, '');
      } else if (path === '.' || path === '..') {
          path = '';
      } else {
          const match = path.match(/^\/?[^\/]*/);
          const segment = match ? match[0] : '';
          path = path.substring(segment.length);
          result += segment;
      }
  }
  return result;
}

type RequiredComponent<T extends keyof UriComponents> = Required<Pick<UriComponents, T>>;
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
 * @param components A uri components object.
 * @returns The subdomain extracted from the host component.
 */
export function getSubdomain(components: UriComponentsInput, tlds: string[] = KnownTlds): string {
    const c = resolveUriComponents(components);
    const host = c.host;
    if (!host) return '';

    // Split the host into parts
    const parts = host.split('.');
    
    // Reverse the array to start checking from TLDs
    const reversedParts = parts.reverse();
    
    // Identify the TLD and remove it along with the second-level domain
    let levelsToRemove = 0;
    for (let i = 0; i < reversedParts.length; i++) {
        if (tlds.includes(reversedParts[i]) || i === 1) { // Assuming the SLD (second-level domain) is always there
            levelsToRemove = i + 2;
            break;
        }
    }

    // Reconstruct the subdomain parts
    const subdomainParts = reversedParts.slice(levelsToRemove).reverse();
    
    return subdomainParts.join('.');
}

/**
 * set the subdomain of a URI.
 * @param components A uri components object or uri string
 * @param subdomain The new subdomain to set
 * @returns A new uri components object with the subdomain set to the given value
 */
export function setSubdomain(components: UriComponentsInput, subdomain: string): UriComponents {
    const c = resolveUriComponents(components);
    
    // Ensure the host is available to manipulate
    if (!c.host) {
        throw new Error('Host component is missing in URI components');
    }
    
      // Extract the domain and any existing subdomains
    const parts = c.host.split('.');
    let domain = parts.slice(-2).join('.'); // Assume the top-level domain consists of two parts (e.g., example.com)

    // Check if there's a known TLD in the parts to handle cases like .co.uk
    for (let i = parts.length - 2; i > 0; i--) {
        if (KnownTlds.includes(parts.slice(i).join('.'))) {
        domain = parts.slice(i - 1).join('.');
        break;
        }
    }

    // Rebuild the host with the new subdomain
    c.host = subdomain ? `${subdomain}.${domain}` : domain;

    // Adjust the authority if it was originally present
    if (c.authority) {
        const port = c.port ? `:${c.port}` : '';
        const userInfo = c.userInfo && c.userInfo.username ? `${c.userInfo.username}:${c.userInfo.password}@` : '';
        c.authority = `${userInfo}${c.host}${port}`;
    }

    return c;
}

/**
 * Set the path of a URI.
 * 
 * @param components A uri components object or uri string
 * @param path The new path to set
 * @returns A new uri components object with the path set to the given value
 */
export function setPath(components: UriComponentsInput, path: string): UriComponents {
    return {
        ...resolveUriComponents(components),
        path,
    };
}


/**
 * Set the host of a URI.
 * @param components A uri components object or uri string
 * @param host The new host to set
 * @returns A new uri components object with the host set to the given value
 */
export function setHost(components: UriComponentsInput, host: string): UriComponents {
    return {
        ...resolveUriComponents(components),
        host,
    };
}


/** 
 * Merge query parameters
 * @param query1 The first query string
 * @param query2 The second query string
 * @param mode The merge mode
 * @returns A new query string with the merged parameters
 */
export function mergeQuery(query1: URLSearchParams, query2: URLSearchParams, mode: 'replace' | 'append' = 'replace') {
    const merged = new URLSearchParams(query1); // Clone the first query to preserve its values

    // Iterate through all entries of the second query
    for (const [key, value] of query2.entries()) {
      if (mode === 'replace') {
        // If the mode is replace, set/overwrite the key in the merged query
        merged.set(key, value);
      } else if (mode === 'append') {
        // If the mode is append and the key already exists, append the value
        if (merged.has(key)) {
          merged.append(key, value);
        } else {
          // If the key doesn't exist, just set it
          merged.set(key, value);
        }
      }
    }
  
    return merged;
}