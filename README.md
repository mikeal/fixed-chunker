# fixed chunker

```javascript
const fixed = require('fixed-chunker')

for await (const chunk of fixed(anyIteratorThatYieldsBuffers, 1024)) {
  console.log(chunk.length) // guaranteed 1024 for all but the last chunk
}
```
