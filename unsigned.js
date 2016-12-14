const Bn = require('bn.js')
const Stream = require('./stream.js')

module.exports = {
  read: (stream) => {
    return module.exports
      .readBn(stream)
      .toString()
  },
  readBn: (stream) => {
    const num = new Bn(0)
    let shift = 0
    let byt
    while (true) {
      byt = stream.read(1)[0]
      num.ior(new Bn(byt & 0x7f).shln(shift))
      if (byt >> 7 === 0) {
        break
      } else {
        shift += 7
      }
    }
    return num
  },
  write: (json, stream) => {
    const num = new Bn(json)
    while (true) {
      const i = num.maskn(7).toNumber()
      num.ishrn(7)
      if (num.isZero()) {
        stream.write([i])
        break
      } else {
        stream.write([i | 0x80])
      }
    }
  },
  /**
   * LEB128 encodeds an interger
   * @param {String|Number} num
   * @return {Buffer}
   */
  encode: (num) => {
    const stream = new Stream()
    module.exports.write(num, stream)
    return stream.buffer
  },
  /**
   * decodes a LEB128 encoded interger
   * @param {Buffer} buffer
   * @return {String}
   */
  decode: (buffer) => {
    const stream = new Stream(buffer)
    return module.exports.read(stream)
  }
}
