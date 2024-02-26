# @anymud/url

`@anymud/url` is a comprehensive library designed for URL manipulation, enabling easy adjustments to subdomains, paths, and hosts, as well as merging URL search parameters with support for replace and append modes. Optimized for modern web development, it supports ESM modules and is compatible with `npm`, `pnpm`, `yarn`, and `bun`, providing a versatile toolset for developers.

## Key Features

- **Dynamic URL Conversion**: Convert various inputs into a URL object, supporting relative URL resolution against a base.
- **Subdomain Manipulation**: Get, set, or replace subdomains with ease, including support for complex TLDs.
- **Path and Host Adjustments**: Directly modify paths and hosts within URLs.
- **Search Parameters Management**: Advanced capabilities for converting to and merging URLSearchParams, with flexible strategies.

## Installation

`@anymud/url` supports installation using `npm`, `pnpm`, `yarn`, or `bun`. It exclusively supports ESM modules. Choose your preferred package manager for installation:

```bash
npm install @anymud/url
```

```bash
pnpm add @anymud/url
```

```bash
yarn add @anymud/url
```

```bash
bun add @anymud/url
```

## Usage Examples

### Converting Input to URL

```javascript
import { toURL } from '@anymud/url';

const url = toURL('/path', 'https://example.com');
console.log(url.href); // Outputs: "https://example.com/path"
```

### Setting Subdomains

```javascript
import { setSubdomain } from '@anymud/url';

const newUrl = setSubdomain('https://example.com', 'blog');
console.log(newUrl.href); // Outputs: "https://blog.example.com"
```

### Merging URL Search Parameters

```javascript
import { mergeURLSearchParams } from '@anymud/url';

const mergedParams = mergeURLSearchParams('a=1&b=2', 'b=3&c=4', 'append');
console.log(mergedParams.toString()); // Outputs: "a=1&b=2&b=3&c=4"
```

## Contributing

We welcome contributions to `@anymud/url`. Whether it's submitting issues, pull requests, or suggestions, your help and feedback are invaluable in improving this library.

## License

`@anymud/url` is licensed under the MIT License.