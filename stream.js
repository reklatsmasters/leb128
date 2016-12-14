// since stream in nodejs don't really work the way I would want them too
module.exports = class FakeStream {
  constructor (buf = new Buffer([])) {
    this.buffer = buf
    this._bytesRead = 0
  }

  read (size) {
    const data = this.buffer.slice(0, size)
    this.buffer = this.buffer.slice(size)
    this._bytesRead += size
    return data
  }

  write (buf) {
    buf = new Buffer(buf)
    this.buffer = Buffer.concat([this.buffer, buf])
  }
}
