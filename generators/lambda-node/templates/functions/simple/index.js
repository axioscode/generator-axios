
console.log('start simple')

// MUST export "handle" function
exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)
  cb(null, { hello: e.hello })
}
