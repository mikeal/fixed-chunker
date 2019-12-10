const getLength = arr => arr.reduce((x, y) => x + y.length, 0)

const fixed = async function * (iter, size = 1024 * 1024) {
  const tail = []
  for await (const chunk of iter) {
    tail.push(chunk)
    while (getLength(tail) >= size) {
      let buff = []
      while (getLength(buff) < size) {
        buff.push(tail.shift())
      }
      buff = Buffer.concat(buff)
      let i = 0
      while (i < (buff.length - (size - 1))) {
        yield buff.subarray(i, i + size)
        i += size
      }
      if (i !== buff.length) {
        tail.unshift(buff.subarray(i))
      }
    }
  }
  if (getLength(tail)) {
    yield Buffer.concat(tail)
  }
}

module.exports = fixed
