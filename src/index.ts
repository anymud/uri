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

export type UriComponentsInput = Omit<UriComponents, 'isUrn'> & { isUrn?: boolean }
function resolveUriComponents(components: UriComponentsInput) : UriComponents {
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
 * @param components An object containing the required 'host' component.
 * @returns The subdomain extracted from the host component.
 */
export function getSubdomain(components: RequiredComponent<'host'>, tlds: string[] = KnownTlds): string {
    const host = components.host;
    const parts = host.split('.');
    if (parts.length <= 2) return '';
    if (tlds.includes(parts[parts.length - 2])) {
        return parts.slice(0, -2).join('.');
    }
    return parts.slice(0, -1).join('.');
}