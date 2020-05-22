# @liquid-js/extractor

A tiny (~4KB) tool to extract DOM tree with styles and pseudo elements. 

### Basic use

```js
import serializeWithStyles from '@liquid-js/extractor'

const element = document.getElementById('target-element')
const htmlCode = serializeWithStyles(element)
```
