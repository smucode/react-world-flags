# react-world-flags 2 beta

Easy to use SVG flags of the world for react

[Demo](https://smucode.github.io/react-world-flags/)

## Changes from V1

- Dynamically load SVGs to avoid huge bundle size
- Use more up to date lib for SVGs, but now flags are 4:3 aspect ratio
- Requires react 18+
- Rewritten to use TS and Vite

## Installation

```
npm install react-world-flags@2.0.0-beta.4
```

## Usage

```javascript
import Flag from 'react-world-flags'
```

```javascript
<Flag code={code} height="20" />
```

Where `code` is the [two letter](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2), [three letter](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) or [three digit](https://en.wikipedia.org/wiki/ISO_3166-1_numeric) country code.

You can also pass an optional `fallback` which renders if the given code doesn't correspond to a flag:

```javascript
import Flag from 'react-world-flags'
```

```javascript
<Flag code="foo" fallback={<span>Unknown</span>} />
```

All props but `code` and `fallback` are passed through to the rendered `img`

```javascript
<Flag code="nor" foo="bar" />

// <img ... foo="bar">
```
