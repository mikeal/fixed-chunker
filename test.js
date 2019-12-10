'use strict'
const assert = require('assert')
const { it } = require('mocha')
const main = require('./')
const { PassThrough } = require('stream')

const test = it

test('basic streaming data', async () => {
  const stream = new PassThrough()
  const buffers = []
  const fill = () => {
    let count = 0
    let interval = setInterval(() => {
      count++
      if (count === 100) {
        clearInterval(interval)
        setTimeout(() => {
          const buffer = Buffer.allocUnsafe(1024)
          buffers.push(buffer)
          stream.end(buffer)
        }, 10)
      }
      const buffer = Buffer.allocUnsafe(1024)
      buffers.push(buffer)
      stream.write(buffer)
    }, 1)
  }
  fill()
  const testBuffers = []
  for await (const chunk of main(stream, 100)) {
    // if (chunk.length !== 100) throw new Error('nope ' + chunk.length)
    testBuffers.push(chunk)
  }
  assert.strictEqual(Buffer.compare(Buffer.concat(buffers), Buffer.concat(testBuffers)), 0)
  const last = testBuffers.pop()
  testBuffers.forEach(b => assert.strictEqual(b.length, 100))
})

test('defaults', async () => {
  const stream = new PassThrough()
  const buffer = Buffer.allocUnsafe(1024 * 1024)
  setTimeout(() => {
    stream.end(buffer)
  })
  const testBuffers = []
  for await (const chunk of main(stream)) {
    testBuffers.push(chunk)
  }
  assert.strictEqual(Buffer.compare(Buffer.concat(testBuffers), buffer), 0)
  assert.strictEqual(testBuffers.length, 1)
  assert.strictEqual(testBuffers[0].length, 1024 * 1024)
})
