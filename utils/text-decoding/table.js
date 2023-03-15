import Encodings from './encodings'
import { UTF8Decoder, UTF8Encoder } from './implementations/utf8'

// 5.2 Names and labels

// TODO: Define @typedef for Encoding: {name:string,labels:Array.<string>}
// https://github.com/google/closure-compiler/issues/247


// Label to encoding registry.
/** @type {Object.<string,{name:string,labels:Array.<string>}>} */
export const label_to_encoding = {}
Encodings.forEach(({ encodings }) => {
  encodings.forEach((encoding) => {
    encoding.labels.forEach((label) => {
      label_to_encoding[label] = encoding
    })
  })
})

// Registry of of encoder/decoder factories, by encoding name.
export const encoders = {
  'UTF-8'() { // 9.1 utf-8
    return new UTF8Encoder()
  }
}

/** @type {Object.<string, function({fatal:boolean}): Decoder>} */
export const decoders = {
  'UTF-8'(options) { // 9.1.1 utf-8 decoder
    return new UTF8Decoder(options)
  }
}