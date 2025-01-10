# Extractor

[![GitHub license](https://img.shields.io/github/license/Liquid-JS/extractor.svg)](https://github.com/Liquid-JS/extractor/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/dm/@liquid-js/extractor.svg)](https://www.npmjs.com/package/@liquid-js/extractor)
[![scope](https://img.shields.io/npm/v/@liquid-js/extractor.svg)](https://www.npmjs.com/package/@liquid-js/extractor)

A tiny (~4KB) tool to extract DOM tree with styles and pseudo elements.

## Installation

    npm install @liquid-js/extractor

## API Documentation

<https://liquid-js.github.io/extractor/>

## Usage

```js
import { serializeWithStyles } from '@liquid-js/extractor'

const element = document.getElementById('target-element')
const htmlCode = serializeWithStyles(element)
```

## License

[MIT License](https://github.com/Liquid-JS/extractor/blob/master/LICENSE)
