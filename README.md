# @anymud/uri

A lightweight JavaScript library for handling Uniform Resource Identifiers (URIs) efficiently.

## Installation

You can install the `@anymud/uri` package via npm, yarn, pnpm or bun:

```console
# npm
npm install @anymud/uri

#yarn
yarn add @anymud/uri

# pnpm
npm install @anymud/uri

# bun
bun install @anymud/uri
```

## Usage

### Importing

You can import the library in your JavaScript/TypeScript files as follows:

```javascript
import * as uri from '@anymud/uri';
```

### Functions

#### `parseUri(uri: string): UriComponents`

This function parses a URI string and returns its components as an object conforming to the `UriComponents` interface.

#### `resolveUri(baseComponents: UriComponentsInput, relativeComponents: UriComponentsInput): UriComponents`

This function resolves a relative URI against a base URI and returns the resulting URI components.

#### `toString(components: UriComponentsInput): string`

Converts a URI components object into a URI string.

#### `getSubdomain(components: RequiredComponent<'host'>, tlds: string[] = KnownTlds): string`

Extracts the subdomain from the host component of a URI. 

More on: [https://anymud.github.io/uri/](https://anymud.github.io/uri/)

### Example

```javascript
import { parseUri, resolveUri, toString } from '@anymud/uri';

const uriString = 'https://www.example.com/path/to/resource?query=123#fragment';
const parsedUri = parseUri(uriString);
console.log(parsedUri);

const baseUri = {
  scheme: 'https',
  host: 'www.example.com',
  path: '/base',
};

const relativeUri = {
  path: 'path/to/resource',
  query: 'query=123',
  fragment: 'fragment',
};

const resolvedUri = resolveUri(baseUri, relativeUri);
console.log(resolvedUri);

const uriString = toString(resolvedUri);
console.log(uriString);
```

## License

This library is released under the MIT License. See the [LICENSE](LICENSE) file for details.