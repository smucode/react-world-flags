# react-world-flags

Easy to use SVG flags of the world for react

[Demo](https://smucode.github.io/react-world-flags/)

## Installation

```
npm install react-world-flags
```

## Usage

```javascript
import Flag from 'react-world-flags'

<Flag code={ code } />
```

Where `code` is the [two letter](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2), [three letter](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) or [three digit](https://en.wikipedia.org/wiki/ISO_3166-1_numeric) country code.

You can also pass an optional `fallback` which renders if the given code doesn't correspond to a flag:

```javascript
import Flag from 'react-world-flags'

<Flag code="foo" fallback={ <span>Unknown</span> }/>
```

All props but `code` and `fallback` are passed through to the rendered `img`

```javascript
<Flag code="nor" height="16" />

// <img src="data:image/svg+xml..." height="16">
```

## Caveat

The bundle contains all flags of the world and is about 1.3 MB gzipped.

SVG's are inlined using [Data_URIs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
