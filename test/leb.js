const tape = require('tape')
const leb = require('../')
const Stream = require('../stream.js')

tape('leb - round trips', t => {
  let stream = new Stream()
  let buffer = leb.unsigned.encode(8)
  t.equals(buffer.toString('hex'), '08')
  t.equals(leb.unsigned.decode(buffer), '8')

  leb.unsigned.write(8, stream)
  t.equals(stream.buffer.toString('hex'), '08')
  t.equals(leb.unsigned.read(stream), '8')

  leb.signed.write('-9223372036854775808', stream)
  t.equals(stream.buffer.toString('hex'), '8080808080808080807f')
  t.equals(leb.signed.read(stream), '-9223372036854775808')

  leb.signed.write('-100', stream)
  t.equals(stream.buffer.toString('hex'), '9c7f')
  t.equals(leb.signed.read(stream), '-100')

  leb.signed.write('100', stream)
  t.equals(stream.buffer.toString('hex'), 'e400')
  t.equals(leb.signed.read(stream), '100')

  leb.signed.write('10', stream)
  t.equals(stream.buffer.toString('hex'), '0a')
  t.equals(leb.signed.read(stream), '10')

  buffer = leb.signed.encode('2141192192')
  t.equals(buffer.toString('hex'), '808080fd07')
  t.equals(leb.signed.decode(buffer), '2141192192')

  leb.signed.write('2141192192', stream)
  t.equals(stream.buffer.toString('hex'), '808080fd07')
  t.equals(leb.signed.read(stream), '2141192192')

  buffer = leb.unsigned.encode('2141192192')
  t.equals(buffer.toString('hex'), '808080fd07')
  t.equals(leb.unsigned.decode(buffer), '2141192192')

  t.end()
})
