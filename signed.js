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
      shift += 7
      if (byt >> 7 === 0) {
        break
      }
    }
    // sign extend if negitive
    if (byt & 0x40) {
      num.setn(shift)
    }
    return num.fromTwos(shift)
  },
  write: (number, stream) => {
    let num = new Bn(number)
    const isNeg = num.isNeg()
    if (isNeg) {
      // add 8 bits for padding
      num = num.toTwos(num.bitLength() + 8)
    }
    while (true) {
      const i = num.maskn(7).toNumber()
      num.ishrn(7)
      if ((isNegOne(num) && (i & 0x40) !== 0) ||
        (num.isZero() && (i & 0x40) === 0)) {
        stream.write([i])
        break
      } else {
        stream.write([i | 0x80])
      }
    }

    function isNegOne (num) {
      return isNeg && num.toString(2).indexOf('0') < 0
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
