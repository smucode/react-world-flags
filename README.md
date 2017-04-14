# react-world-flags
SVG flags of the world for react

## Installation

`npm install react-world-flags`

## Usage

```
import Flag from 'react-world-flags'

<Flag code={ code } />
```

Where `code` is either in the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2), [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) or [ISO 3166-1 numeric](https://en.wikipedia.org/wiki/ISO_3166-1_numeric) format.

## Caveat

The bundle contains all flags of the world and is about 1.3 MB. 

SVG's are inserted as [Data_URIs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
